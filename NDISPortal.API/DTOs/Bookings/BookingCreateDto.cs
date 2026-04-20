using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace NDISPortal.API.DTOs.Bookings
{
    public class BookingCreateDto
    {
        [Required(ErrorMessage = "Service ID is required.")]
        [JsonPropertyName("service_id")]
        public int ServiceId { get; set; }

        [Required(ErrorMessage = "Preferred date is required.")]
        [JsonPropertyName("preferred_date")]
        public DateTime PreferredDate { get; set; }

        [MaxLength(500, ErrorMessage = "Notes must not exceed 500 characters.")]
        [JsonPropertyName("notes")]
        public string? Notes { get; set; }
    }
}