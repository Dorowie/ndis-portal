using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using NDISPortal.API.Data;
using NDISPortal.API.DTOs.Auth;
using NDISPortal.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace NDISPortal.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        //REGISTRATION
        public async Task<(bool Success, int? UserId, string? Email)> RegisterAsync(RegisterDto dto)
        {

            var emailExists = await _context.Users
                .AnyAsync(u => u.email == dto.Email);

            if (emailExists)
            {
                return (false,null,null);
            }


            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);
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


            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return (true,user.id,user.email);
        }

        //LOGIN 
        public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.email == dto.Email);

            if (user == null)
            {
                return null;
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.password_hash);

            if (!isPasswordValid)
            {
                return null;
            }

            var token = GenerateJwtToken(user);

            return new AuthResponseDto
            {
                UserId = user.id,
                Email = user.email,
                Role = user.role,
                Token = token
            };
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim("userId", user.id.ToString()),
                new Claim(ClaimTypes.Email, user.email),
                new Claim(ClaimTypes.Role, user.role)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
            );

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}