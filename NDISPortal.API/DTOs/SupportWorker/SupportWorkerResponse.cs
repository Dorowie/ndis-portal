using System.Text.Json.Serialization;

namespace NDISPortal.API.DTOs.SupportWorker
{
    public class SupportWorkerResponseDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("fullName")]
        public string FullName { get; set; } = string.Empty;

        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("phone")]
        public string? Phone { get; set; }

        [JsonPropertyName("assignedService")]
        public string ServiceName { get; set; } = string.Empty;

        [JsonPropertyName("serviceName")]
        public string ServiceNameAlt => ServiceName;
    }
}