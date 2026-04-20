using NDISPortal.API.DTOs.Auth;

namespace NDISPortal.API.Services
{
    public interface IAuthService
    {
        Task<(bool Success, int? UserId, string? Email)> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto?> LoginAsync(LoginDto dto);
    }
}