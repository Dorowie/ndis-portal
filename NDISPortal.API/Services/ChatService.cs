using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using NDISPortal.API.DTOs.Chat;

namespace NDISPortal.API.Services
{
    public class ChatService : IChatService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public ChatService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<ChatResponseDto> GetReplyAsync(ChatRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
                throw new ArgumentException("Message cannot be empty.");

            var apiKey = _configuration["Anthropic:ApiKey"];

            if (string.IsNullOrWhiteSpace(apiKey))
                throw new InvalidOperationException("Anthropic API key not configured.");

            var payload = new AnthropicRequest
            {
                Model = "claude-haiku-4-5",
                MaxTokens = 300,
                Temperature = 0.2,
                System = BuildSystemPrompt(),
                Messages = BuildMessages(request)
            };

            using var httpRequest = new HttpRequestMessage(HttpMethod.Post, "https://api.anthropic.com/v1/messages");

            httpRequest.Headers.Add("x-api-key", apiKey);
            httpRequest.Headers.Add("anthropic-version", "2023-06-01");
            httpRequest.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var json = JsonSerializer.Serialize(payload, JsonOptions());
            httpRequest.Content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(httpRequest);
            var body = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new InvalidOperationException("Claude API request failed.");

            var result = JsonSerializer.Deserialize<AnthropicResponse>(body, JsonOptions());

            var reply = result?.Content?
                .FirstOrDefault(x => x.Type == "text")?
                .Text;

            if (string.IsNullOrWhiteSpace(reply))
                throw new InvalidOperationException("Empty response from Claude.");

            return new ChatResponseDto
            {
                Reply = reply.Trim()
            };
        }

        private static List<AnthropicMessage> BuildMessages(ChatRequestDto request)
        {
            var messages = new List<AnthropicMessage>();

            var history = request.ConversationHistory?
                .Where(m => !string.IsNullOrWhiteSpace(m.Content))
                .TakeLast(5);

            if (history != null)
            {
                foreach (var msg in history)
                {
                    messages.Add(new AnthropicMessage
                    {
                        Role = NormalizeRole(msg.Role),
                        Content = msg.Content.Trim()
                    });
                }
            }

            messages.Add(new AnthropicMessage
            {
                Role = "user",
                Content = request.Message.Trim()
            });

            return messages;
        }

        private static string NormalizeRole(string? role)
        {
            return role?.ToLower() == "assistant" ? "assistant" : "user";
        }

        private static string BuildSystemPrompt()
        {
            return """
                You are a friendly and helpful support assistant for an NDIS (National Disability Insurance Scheme) participant service portal.

                ROLE:
                You act strictly as an assistant within this portal.

                YOUR RESPONSIBILITIES:
                - Help users understand support services
                - Explain service categories in plain language
                - Guide users in making bookings
                - Answer general questions about the portal
                - Provide general NDIS information

                AVAILABLE SERVICES:
                - Daily Personal Activities
                - Community Access
                - Therapy Supports
                - Respite Care
                - Support Coordination

                RESPONSE STYLE:
                - Clear, simple, friendly
                - Supportive and patient
                - Max 3 short paragraphs

                RESTRICTIONS:
                - No medical, legal, or financial advice
                - No plan recommendations
                - No personal data handling
                - No unrelated topics

                WHEN UNSURE:
                Suggest contacting a Support Coordinator.
                """;
        }

        private static JsonSerializerOptions JsonOptions()
        {
            return new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
            };
        }

        private class AnthropicRequest
        {
            public string Model { get; set; } = "";
            public int MaxTokens { get; set; }
            public double Temperature { get; set; }
            public string System { get; set; } = "";
            public List<AnthropicMessage> Messages { get; set; } = new();
        }

        private class AnthropicMessage
        {
            public string Role { get; set; } = "";
            public string Content { get; set; } = "";
        }

        private class AnthropicResponse
        {
            public List<AnthropicContent>? Content { get; set; }
        }

        private class AnthropicContent
        {
            public string? Type { get; set; }
            public string? Text { get; set; }
        }
    }
}