using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using NDISPortal.API.Data;
using NDISPortal.API.DTOs.ServiceRecommendation;

namespace NDISPortal.API.Services
{
    public class ServiceRecommendationService : IServiceRecommendationService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public ServiceRecommendationService(
            HttpClient httpClient,
            IConfiguration configuration,
            ApplicationDbContext context)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _context = context;
        }

        private class ServiceInfo
        {
            public int id { get; set; }
            public string name { get; set; } = string.Empty;
            public string description { get; set; } = string.Empty;
            public string CategoryName { get; set; } = string.Empty;
        }

        public async Task<ServiceRecommendationResponseDto> GetRecommendationsAsync(ServiceRecommendationRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.UserSituation))
                throw new ArgumentException("User situation cannot be empty.");

            if (string.IsNullOrWhiteSpace(request.SupportNeeds))
                throw new ArgumentException("Support needs cannot be empty.");

            var apiKey =
                _configuration["Anthropic:ApiKey"] ??
                Environment.GetEnvironmentVariable("ANTHROPIC_API_KEY");

            if (string.IsNullOrWhiteSpace(apiKey))
                throw new InvalidOperationException("Anthropic API key is not configured.");

            // Fetch available services from database
            var services = await _context.Services
                .Include(s => s.Category)
                .Where(s => s.is_active)
                .Select(s => new ServiceInfo
                {
                    id = s.id,
                    name = s.name,
                    description = s.description,
                    CategoryName = s.Category != null ? s.Category.name : "Uncategorized"
                })
                .ToListAsync();

            if (!services.Any())
            {
                return new ServiceRecommendationResponseDto
                {
                    Summary = "No services are currently available in the portal.",
                    Recommendations = new List<RecommendedServiceDto>()
                };
            }

            // Build knowledge context for AI
            var knowledgeContext = BuildKnowledgeContext(services);

            // Build system prompt for service recommendations
            var systemPrompt = BuildSystemPrompt();

            // Build messages
            var messages = new List<AnthropicMessage>
            {
                new AnthropicMessage
                {
                    Role = "user",
                    Content = $"Use this portal knowledge when recommending services:\n\n{knowledgeContext}\n\n" +
                              $"Participant Situation: {request.UserSituation}\n" +
                              $"Support Needs: {request.SupportNeeds}"
                }
            };

            // Add conversation history if available
            if (request.ConversationHistory != null && request.ConversationHistory.Any())
            {
                foreach (var historyItem in request.ConversationHistory.TakeLast(5))
                {
                    messages.Add(new AnthropicMessage
                    {
                        Role = "user",
                        Content = historyItem
                    });
                }
            }

            var payload = new AnthropicRequest
            {
                Model = "claude-haiku-4-5",
                MaxTokens = 800,
                Temperature = 0.3,
                System = systemPrompt,
                Messages = messages
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
            var reply = result?.Content?.FirstOrDefault(x => x.Type == "text")?.Text?.Trim();

            if (string.IsNullOrWhiteSpace(reply))
            {
                throw new InvalidOperationException("Empty response from Claude.");
            }

            // Parse the AI response to extract recommendations
            return ParseRecommendations(reply, services);
        }

        private string BuildKnowledgeContext(List<ServiceInfo> services)
        {
            var sb = new StringBuilder();
            sb.AppendLine("Available Services in the Portal:");
            sb.AppendLine();

            foreach (var service in services)
            {
                sb.AppendLine($"Service ID: {service.id}");
                sb.AppendLine($"Name: {service.name}");
                sb.AppendLine($"Category: {service.CategoryName}");
                sb.AppendLine($"Description: {service.description}");
                sb.AppendLine();
            }

            return sb.ToString().Trim();
        }

        private string BuildSystemPrompt()
        {
            return """
You are a helpful NDIS support assistant that recommends appropriate services to participants based on their situation and support needs.

Your task:
1. Analyze the participant's situation and support needs
2. Match their needs with the available services in the portal
3. Recommend the most relevant services (maximum 5)
4. Provide a brief explanation for why each service is recommended

Response Format:
Provide your response in the following exact format:

SUMMARY: [A brief summary of your analysis in 1-2 sentences]

RECOMMENDATION 1:
- Service Name: [Exact service name from the portal]
- Service ID: [Exact service ID from the portal]
- Reason: [Brief explanation why this service fits their needs]

RECOMMENDATION 2:
- Service Name: [Exact service name from the portal]
- Service ID: [Exact service ID from the portal]
- Reason: [Brief explanation why this service fits their needs]

[Continue for each recommendation, maximum 5]

Guidelines:
- Only recommend services that exist in the provided portal knowledge
- Use the exact service names and IDs from the portal
- READ and ANALYZE each service's DESCRIPTION carefully to understand what the service offers
- Match services based on detailed DESCRIPTION content, not just service name or category
- Consider keywords in the user's situation/needs and match them to keywords in service descriptions
- Recommend services whose descriptions directly address the user's specific challenges
- If a service description mentions specific conditions or needs that match the user, prioritize that service
- If no services match, explain that clearly
- Be empathetic and supportive in your tone
- Keep explanations concise and practical
- In your reason, reference specific details from the service description that match the user's needs
""";
        }

        private ServiceRecommendationResponseDto ParseRecommendations(string aiResponse, List<ServiceInfo> services)
        {
            var response = new ServiceRecommendationResponseDto();
            var recommendations = new List<RecommendedServiceDto>();

            // Extract summary
            var summaryMatch = System.Text.RegularExpressions.Regex.Match(aiResponse, @"SUMMARY:\s*(.*?)(?=RECOMMENDATION|$)", System.Text.RegularExpressions.RegexOptions.IgnoreCase | System.Text.RegularExpressions.RegexOptions.Singleline);
            response.Summary = summaryMatch.Success ? summaryMatch.Groups[1].Value.Trim() : "Based on your needs, here are the recommended services.";

            // Extract recommendations
            var recommendationMatches = System.Text.RegularExpressions.Regex.Matches(aiResponse, @"RECOMMENDATION\s*\d*:\s*-?\s*Service Name:\s*(.*?)\s*-?\s*Service ID:\s*(\d+)\s*-?\s*Reason:\s*(.*?)(?=RECOMMENDATION|$)", System.Text.RegularExpressions.RegexOptions.IgnoreCase | System.Text.RegularExpressions.RegexOptions.Singleline);

            foreach (System.Text.RegularExpressions.Match match in recommendationMatches)
            {
                var serviceName = match.Groups[1].Value.Trim();
                var serviceId = int.Parse(match.Groups[2].Value.Trim());
                var reason = match.Groups[3].Value.Trim();

                // Find the service in the database to get full details
                var service = services.FirstOrDefault(s => s.id == serviceId);
                if (service != null)
                {
                    recommendations.Add(new RecommendedServiceDto
                    {
                        Id = service.id,
                        Name = service.name,
                        Description = service.description,
                        CategoryName = service.CategoryName,
                        Reason = reason
                    });
                }
            }

            // If parsing failed, provide a fallback response
            if (!recommendations.Any() && services.Any())
            {
                response.Summary = "I analyzed your needs and found some services that might help. Here are the top recommendations:";
                foreach (var service in services.Take(3))
                {
                    recommendations.Add(new RecommendedServiceDto
                    {
                        Id = service.id,
                        Name = service.name,
                        Description = service.description,
                        CategoryName = service.CategoryName,
                        Reason = "This service may address your support needs based on the available options."
                    });
                }
            }

            response.Recommendations = recommendations.Take(5).ToList();
            return response;
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
