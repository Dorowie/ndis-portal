using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace NDISPortal.API.DTOs.Bookings
{
    public class BookingStatusUpdateDto
    {
        [Required(ErrorMessage = "Status is required.")]
        [Range(0, 2, ErrorMessage = "Status must be 0 (Pending), 1 (Approved), or 2 (Cancelled).")]
        [JsonPropertyName("status")]
        public byte Status { get; set; }
    }
}
