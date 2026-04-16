using Microsoft.EntityFrameworkCore;
using NDISPortal.API.Data;
using NDISPortal.API.DTOs.Auth;
using NDISPortal.API.Models;

namespace NDISPortal.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;

        public AuthService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<(bool Success, int? UserId, string? Email)> RegisterAsync(RegisterDto dto)
        {
            // 🔥 Check if email already exists
            var emailExists = await _context.Users
                .AnyAsync(u => u.email == dto.Email);

            if (emailExists)
            {
                return (false,null,null);
            }

            // 🔐 Hash password
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            // 🧩 Map DTO → Model
            var user = new User
            {
                first_name = dto.FirstName,
                last_name = dto.LastName,
                email = dto.Email,
                password_hash = hashedPassword,
                role = dto.Role,
                created_date = DateTime.UtcNow,
                modified_date = DateTime.UtcNow
            };

            // 💾 Save to DB
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return (true,user.id,user.email);
        }
    }
}