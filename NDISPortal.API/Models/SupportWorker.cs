using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace NDISPortal.API.Models
{
    [Table("support_workers")]
    public class SupportWorker
    {
        public int Id { get; set; }

        [Column("service_id")]
        public int ServiceId { get; set; }
        public Service? Service { get; set; }

        [Column("first_name")]
        public string FirstName { get; set; } = "";

        [Column("last_name")]   
        public string LastName { get; set; } = "";
            
        [Column("email")]
        public string Email { get; set; } = "";

        [Column("phone")]
        public string Phone { get; set; } = "";

        [Column("created_date")]
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column("modified_date")]
        public DateTime ModifiedDate { get; set; } = DateTime.Now;
    }
}