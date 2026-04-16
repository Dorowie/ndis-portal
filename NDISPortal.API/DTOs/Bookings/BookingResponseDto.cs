using System.Text.Json.Serialization;

namespace NDISPortal.API.DTOs.Bookings
{
    public class BookingResponseDto
    {
        [JsonPropertyName("booking_id")]
        public int Id { get; set; }

        [JsonPropertyName("user_id")]
        public int UserId { get; set; }

        [JsonPropertyName("service_id")]
        public int ServiceId { get; set; }

        [JsonPropertyName("booking_date")]
        public DateTime BookingDate { get; set; }

        [JsonPropertyName("notes")]
        public string? Notes { get; set; }

        [JsonPropertyName("status")]
        public byte Status { get; set; }

        [JsonIgnore]
        public string StatusLabel => Status switch
        {
            0 => "Pending",
            1 => "Approved",
            2 => "Cancelled",
            _ => "Unknown"
        };

        [JsonPropertyName("created_date")]
        public DateTime CreatedDate { get; set; }

        [JsonPropertyName("modified_date")]
        public DateTime ModifiedDate { get; set; }

        [JsonPropertyName("service_name")]
        public string? ServiceName { get; set; }

        [JsonPropertyName("category_id")]
        public int? CategoryId { get; set; }

        [JsonPropertyName("category_name")]
        public string? CategoryName { get; set; }
    }
}
