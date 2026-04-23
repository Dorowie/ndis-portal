using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NDISPortal.API.Models
{
    [Table("bookings")]
    public class Booking
    {
        [Key]
        public int id { get; set; }

        [Required]
        public int user_id { get; set; }

        [Required]
        public int service_id { get; set; }

        [Required]
        public DateTime booking_date { get; set; }

        [MaxLength(500)]
        public string? notes { get; set; }

        public byte status { get; set; } = 0;

        [NotMapped]
        public string status_label => status switch
        {
            0 => "Pending",
            1 => "Approved", 
            2 => "Cancelled",
            _ => "Pending"
        };

        public DateTime created_date { get; set; }

        public DateTime modified_date { get; set; }

        [ForeignKey("user_id")]
        public virtual User? User { get; set; }

        [ForeignKey("service_id")]
        public virtual Service? Service { get; set; }
    }
}
