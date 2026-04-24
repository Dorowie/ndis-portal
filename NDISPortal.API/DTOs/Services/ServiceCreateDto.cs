using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace NDISPortal.API.DTOs.Services
{
    public class ServiceCreateDto
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
    }
}
