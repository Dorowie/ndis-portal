using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NDISPortal.API.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        public int id { get; set; }

        [Required]
        [MaxLength(50)]
        public string first_name { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string last_name { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string email { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string password_hash { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string role { get; set; } = string.Empty;

        public DateTime created_date { get; set; }

        public DateTime modified_date { get; set; }

        public virtual ICollection<Booking> bookings { get; set; } = new List<Booking>();
    }
}