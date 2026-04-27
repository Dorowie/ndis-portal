using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace NDISPortal.API.DTOs.Services
{
    public class ServiceUpdateDto
    {
        [Required]
        [JsonPropertyName("is_active")]
        public bool IsActive { get; set; }
    }
}
