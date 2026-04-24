using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NDISPortal.API.Models
{
    [Table("service_categories")]
    public class ServiceCategory
    {
        [Key]
        public int id { get; set; }

        [Required]
        [MaxLength(50)]
        public string name { get; set; } = string.Empty;

        public DateTime created_date { get; set; }

        public DateTime modified_date { get; set; }

        public virtual ICollection<Service> Services { get; set; } = new List<Service>();
    }
}
