using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace NDISPortal.API.DTOs.Services
{
    public class ServiceUpdateDto
    {
        [Required(ErrorMessage = "Category ID is required.")]
        [JsonPropertyName("category_id")]
        public int CategoryId { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [MaxLength(50, ErrorMessage = "Name must not exceed 50 characters.")]
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required.")]
        [MaxLength(200, ErrorMessage = "Description must not exceed 200 characters.")]
        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("is_active")]
        public bool IsActive { get; set; }
    }
}
