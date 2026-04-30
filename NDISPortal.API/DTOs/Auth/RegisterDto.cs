using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace NDISPortal.API.DTOs.Auth
{
    public class RegisterDto
    {
        private string _firstName = string.Empty;
        private string _lastName = string.Empty;
        private string _email = string.Empty;
        private string _role = string.Empty;

        [Required(ErrorMessage = "First name is required.")]
        [MaxLength(50, ErrorMessage = "First name must not exceed 50 characters.")]
        [RegularExpression("^[a-zA-Z]+( [a-zA-Z]+)*$", ErrorMessage = "First name must contain only letters.")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last name is required.")]
        [MaxLength(50, ErrorMessage = "Last name must not exceed 50 characters.")]
        [RegularExpression("^[a-zA-Z]+( [a-zA-Z]+)*$", ErrorMessage = "Last name must contain only letters.")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [MaxLength(150, ErrorMessage = "Email must not exceed 150 characters.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "Email must be in this format (email@example.com).")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters.")]
        [MaxLength(100, ErrorMessage = "Password must not exceed 100 characters.")]
        [JsonPropertyName("password")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Role is required.")]
        [RegularExpression("^(Participant|Coordinator)$", ErrorMessage = "Role must be Participant or Coordinator.")]
        public string Role { get; set; } = string.Empty;
    }
}
