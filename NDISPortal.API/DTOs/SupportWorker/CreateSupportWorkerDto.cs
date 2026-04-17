using System.ComponentModel.DataAnnotations;

namespace NDISPortal.API.DTOs.SupportWorker
{
    public class CreateSupportWorkerDto
    {
        [Required]
        [StringLength(50)]
        [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "First name must contain letters only")]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "Last name must contain letters only")]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(150)] 
        public string Email { get; set; } = string.Empty;

        [Required]
        [RegularExpression(@"^\d{10,15}$", ErrorMessage = "Phone must be numbers only (10–15 digits)")]
        public string Phone { get; set; } = string.Empty;

        [Required]
        [Range(1, int.MaxValue)]
        public int AssignedServiceId { get; set; }
    }
}