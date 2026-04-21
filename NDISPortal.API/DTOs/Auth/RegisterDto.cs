using System.ComponentModel.DataAnnotations;

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
        [RegularExpression(@"^[A-Za-z]+(?: [A-Za-z]+)*$", ErrorMessage = "First name must contain only letters and single spaces.")]
        public string FirstName
        {
            get => _firstName;
            set => _firstName = value?.Trim() ?? string.Empty;
        }

        [Required(ErrorMessage = "Last name is required.")]
        [MaxLength(50, ErrorMessage = "Last name must not exceed 50 characters.")]
        [RegularExpression(@"^[A-Za-z]+(?: [A-Za-z]+)*$", ErrorMessage = "Last name must contain only letters and single spaces.")]
        public string LastName
        {
            get => _lastName;
            set => _lastName = value?.Trim() ?? string.Empty;
        }

        [Required(ErrorMessage = "Email is required.")]
        [MaxLength(150, ErrorMessage = "Email must not exceed 150 characters.")]
        [EmailAddress(ErrorMessage = "Email format is invalid.")]
        [RegularExpression(@"^\S+@\S+\.\S+$", ErrorMessage = "Email must not contain spaces.")]
        public string Email
        {
            get => _email;
            set => _email = value?.Trim() ?? string.Empty;
        }

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters.")]
        [MaxLength(100, ErrorMessage = "Password must not exceed 100 characters.")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Role is required.")]
        [RegularExpression(@"^(Participant|Coordinator)$", ErrorMessage = "Role must be Participant or Coordinator.")]
        public string Role
        {
            get => _role;
            set => _role = value?.Trim() ?? string.Empty;
        }
    }
}
