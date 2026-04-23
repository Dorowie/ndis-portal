using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace NDISPortal.API.DTOs.Services
{
    public class ServiceUpdateDto
    {
        [Required]
        [JsonPropertyName("category_id")]
        public int CategoryId { get; set; }

        [Required]
        [MaxLength(50)]
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        [JsonPropertyName("description")]
        public string Description { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("is_active")]
        public bool IsActive { get; set; }
    }
}
