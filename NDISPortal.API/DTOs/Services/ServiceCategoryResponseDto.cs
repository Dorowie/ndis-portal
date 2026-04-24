using System.Text.Json.Serialization;

namespace NDISPortal.API.DTOs.Services
{
    public class ServiceCategoryResponseDto
    {
        [JsonPropertyName("category_id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("services")]
        public List<ServiceSummaryDto> Services { get; set; } = new List<ServiceSummaryDto>();
    }

    public class ServiceSummaryDto
    {
        [JsonPropertyName("service_id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("description")]
        public string Description { get; set; } = string.Empty;

        [JsonPropertyName("is_active")]
        public bool IsActive { get; set; }
    }
}
