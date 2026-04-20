using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace NDISPortal.API.DTOs.Bookings
{
    public class BookingStatusUpdateDto
    {
        [Required(ErrorMessage = "Status is required.")]
        [RegularExpression("^(Approved|Cancelled)$", ErrorMessage = "Status must be 'Approved' or 'Cancelled'.")]
        [JsonPropertyName("status")]
        public string Status { get; set; } = string.Empty;
    }
}
