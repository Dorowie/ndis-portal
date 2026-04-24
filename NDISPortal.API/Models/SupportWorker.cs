using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace NDISPortal.API.Models
{
    [Table("support_workers")]
    public class SupportWorker
    {
        public int id { get; set; }
        [ForeignKey("Service")]
        public int service_id { get; set; }
        public Service? Service { get; set; }

        public string first_name { get; set; } = string.Empty;

        public string last_name { get; set; } = string.Empty;

        public string email { get; set; } = string.Empty;

        public string? phone { get; set; }

        public DateTime created_date { get; set; } = DateTime.UtcNow;

        public DateTime modified_date { get; set; } = DateTime.UtcNow;
    }
}