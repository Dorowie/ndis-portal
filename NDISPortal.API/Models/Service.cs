using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NDISPortal.API.Models
{
    [Table("services")]
    public class Service
    {
        [Key]
        public int id { get; set; }

        [Required]
        public int category_id { get; set; }

        [Required]
        [MaxLength(50)]
        public string name { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string description { get; set; } = string.Empty;

        public bool is_active { get; set; } = true;

        public DateTime created_date { get; set; }

        public DateTime modified_date { get; set; }

        [ForeignKey("category_id")]
        public virtual ServiceCategory? Category { get; set; }

        public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
