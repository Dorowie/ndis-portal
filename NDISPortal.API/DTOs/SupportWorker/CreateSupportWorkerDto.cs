using System.ComponentModel.DataAnnotations;

namespace NDISPortal.API.DTOs.SupportWorker
{
    public class CreateSupportWorkerDto
    {
        [Required]
        [StringLength(20)]
        [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "First name must contain letters only")]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(30)]
        [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "Last name must contain letters only")]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(20)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [RegularExpression(@"^\d{10,15}$", ErrorMessage = "Phone must be numbers only (10–15 digits)")]
        public string? Phone { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "AssignedServiceId must be greater than 0")]
        public int AssignedServiceId { get; set; }
    }
}