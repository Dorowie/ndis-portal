using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using NDISPortal.API.Data;
using NDISPortal.API.DTOs.Chat;

namespace NDISPortal.API.Services
{
    public class ChatService : IChatService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public ChatService(
            HttpClient httpClient,
            IConfiguration configuration,
            ApplicationDbContext context)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _context = context;
        }

        public async Task<ChatResponseDto> GetReplyAsync(ChatRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
                throw new ArgumentException("Message cannot be empty.");

            var apiKey = _configuration["Anthropic:ApiKey"] ?? Environment.GetEnvironmentVariable("ANTHROPIC_API_KEY");

            if (string.IsNullOrWhiteSpace(apiKey))
                throw new InvalidOperationException("Anthropic API key is not configured.");

            var knowledgeContext = await GetKnowledgeContextAsync(request.Message);

            var payload = new AnthropicRequest
            {
                Model = "claude-haiku-4-5",
                MaxTokens = 400,
                Temperature = 0.2,
                System = BuildSystemPrompt(),
                Messages = BuildMessages(request, knowledgeContext)
            };

            using var httpRequest = new HttpRequestMessage(HttpMethod.Post, "https://api.anthropic.com/v1/messages");
            httpRequest.Headers.Add("x-api-key", apiKey);
            httpRequest.Headers.Add("anthropic-version", "2023-06-01");
            httpRequest.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var json = JsonSerializer.Serialize(payload, JsonOptions());
            httpRequest.Content = new StringContent(json, Encoding.UTF8, "application/json");

            using var response = await _httpClient.SendAsync(httpRequest);
            var body = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new InvalidOperationException("Claude API request failed.");
            }

            var result = JsonSerializer.Deserialize<AnthropicResponse>(body, JsonOptions());

            var reply = result?.Content?
                .FirstOrDefault(x => x.Type == "text")?
                .Text?
                .Trim();

            if (string.IsNullOrWhiteSpace(reply))
            {
                throw new InvalidOperationException("Empty response from Claude.");
            }

            return new ChatResponseDto
            {
                Reply = reply
            };
        }

        private async Task<string?> GetKnowledgeContextAsync(string userQuestion)
        {
            var normalizedQuestion = userQuestion.Trim().ToLower();

            var services = await _context.Services
                .Include(s => s.Category)
                .Where(s => s.is_active)
                .Select(s => new
                {
                    ServiceName = s.name,
                    ServiceDescription = s.description,
                    CategoryName = s.Category != null ? s.Category.name : "Uncategorized"
                })
                .ToListAsync();

            if (!services.Any())
            {
                return null;
            }

            var categories = services
                .Select(s => s.CategoryName)
                .Where(c => !string.IsNullOrWhiteSpace(c))
                .Distinct()
                .OrderBy(c => c)
                .ToList();

            var asksForCategories =
                normalizedQuestion.Contains("category") ||
                normalizedQuestion.Contains("categories") ||
                normalizedQuestion.Contains("service category") ||
                normalizedQuestion.Contains("service categories");

            var asksForServices =
                normalizedQuestion.Contains("service") ||
                normalizedQuestion.Contains("services") ||
                normalizedQuestion.Contains("available support") ||
                normalizedQuestion.Contains("available services");

            var matchedServices = services
                .Where(s =>
                    normalizedQuestion.Contains((s.ServiceName ?? string.Empty).ToLower()) ||
                    normalizedQuestion.Contains((s.CategoryName ?? string.Empty).ToLower()) ||
                    (!string.IsNullOrWhiteSpace(s.ServiceDescription) &&
                     s.ServiceDescription.ToLower().Contains(normalizedQuestion)))
                .Take(5)
                .ToList();

            var sb = new StringBuilder();
            sb.AppendLine("Portal knowledge base:");
            sb.AppendLine();

            // 1. User asks only for categories
            if (asksForCategories && !asksForServices)
            {
                sb.AppendLine("Available service categories:");
                foreach (var category in categories)
                {
                    sb.AppendLine($"- {category}");
                }

                return sb.ToString().Trim();
            }

            // 2. User asks only for services
            if (asksForServices && !asksForCategories)
            {
                sb.AppendLine("Current active services in the portal:");
                foreach (var service in services.OrderBy(s => s.ServiceName).Take(10))
                {
                    sb.AppendLine($"- {service.ServiceName}");
                }

                return sb.ToString().Trim();
            }

            // 3. User asks about a specific service or something related
            if (matchedServices.Any())
            {
                sb.AppendLine("Relevant services from the portal:");
                foreach (var service in matchedServices)
                {
                    sb.AppendLine($"- Service: {service.ServiceName}");
                    sb.AppendLine($"  Category: {service.CategoryName}");

                    if (!string.IsNullOrWhiteSpace(service.ServiceDescription))
                    {
                        sb.AppendLine($"  Description: {service.ServiceDescription}");
                    }

                    sb.AppendLine();
                }

                return sb.ToString().Trim();
            }

            // 4. Generic fallback
            sb.AppendLine("Available service categories:");
            foreach (var category in categories)
            {
                sb.AppendLine($"- {category}");
            }

            sb.AppendLine();
            sb.AppendLine("Current active services in the portal:");
            foreach (var service in services.OrderBy(s => s.ServiceName).Take(8))
            {
                sb.AppendLine($"- {service.ServiceName}");
            }

            return sb.ToString().Trim();
        }

        private static List<AnthropicMessage> BuildMessages(ChatRequestDto request, string? knowledgeContext)
        {
            var messages = new List<AnthropicMessage>();

            if (!string.IsNullOrWhiteSpace(knowledgeContext))
            {
                messages.Add(new AnthropicMessage
                {
                    Role = "user",
                    Content = $"Use this portal knowledge when answering:\n\n{knowledgeContext}"
                });
            }

            var history = request.ConversationHistory?
                .Where(m => !string.IsNullOrWhiteSpace(m.Content))
                .TakeLast(5)
                .ToList();

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
            return role?.Trim().ToLower() == "assistant" ? "assistant" : "user";
        }

        private static string BuildSystemPrompt()
        {
            return """
            You are a warm, friendly, and helpful support assistant for an NDIS (National Disability Insurance Scheme) participant service portal.

            Your role is to assist users in a human, supportive, and respectful way, as if you are a real person helping them understand the portal and its available services.

            You help users by:
            - Explaining available services and service categories in plain language
            - Answering general questions about how the portal works
            - Guiding users on how to make a booking
            - Providing general information about NDIS-related support within the scope of this portal

            Use the portal knowledge provided in the conversation as your main source of truth.
            If portal knowledge is available, base your answer on that information.
            Do not invent services, categories, schedules, staff details, prices, or other portal information that has not been provided.
            If the answer is not available in the portal knowledge, say so clearly and politely.

            Tone and communication style:
            - Speak like a real support assistant talking to a person
            - Be warm, calm, patient, and supportive
            - Use simple, clear, and natural language
            - Avoid sounding robotic, overly formal, or overly technical
            - Keep responses easy to read and easy to understand
            - Keep responses concise, ideally no more than 3 short paragraphs unless the user asks for more detail
            - If explaining a process, present it in short step-by-step form
            - When appropriate, acknowledge the user naturally with phrases like "I can help with that" or "Here’s what I found"

            Service and portal behavior:
            - If the user asks about a service or category, explain it in simple terms first, then mention relevant portal-based details if available
            - If the user asks for available services, list the services clearly
            - If the user asks for service categories, list the categories clearly
            - If a matching service exists in the portal knowledge, mention it naturally
            - If no matching service is found, say that you could not find a matching service in the current portal information

            Booking behavior:
            - If the user asks how to book, explain the booking process in short and clear steps
            - If the exact booking flow is not available in the portal knowledge, do not invent extra details; instead, give general guidance only

            Location and contact behavior:
            - If the user asks for the location, address, or contact details, you may provide:
              - Address: FAB, Mariveles, Bataan
              - Contact number: 0912345678
            - If the user asks for location or contact details beyond what is provided, do not invent anything else

            Boundaries:
            - Do not provide medical, legal, or financial advice
            - Do not make decisions or recommendations about a participant’s NDIS plan
            - Do not ask for or process sensitive personal information
            - Do not answer unrelated topics as if you are a general-purpose chatbot

            When unsure:
            - Be honest if information is unavailable, unclear, or not found in the portal data
            - Politely suggest contacting a Support Coordinator when appropriate

            Response construction:
            - Start with a direct and helpful answer
            - Briefly explain using portal-based information when available
            - End with a short helpful next step only when appropriate
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
            public string Model { get; set; } = string.Empty;
            public int MaxTokens { get; set; }
            public double Temperature { get; set; }
            public string System { get; set; } = string.Empty;
            public List<AnthropicMessage> Messages { get; set; } = new();
        }

        private class AnthropicMessage
        {
            public string Role { get; set; } = string.Empty;
            public string Content { get; set; } = string.Empty;
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