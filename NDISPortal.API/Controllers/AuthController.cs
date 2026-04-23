using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NDISPortal.API.DTOs;
using NDISPortal.API.DTOs.Auth;
using NDISPortal.API.Services;

namespace NDISPortal.API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    [AllowAnonymous]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                
                return BadRequest(new ApiResponse<object>(
                    success: false,
                    message: "Validation failed. Please check your input.",
                    errors: errors
                ));
            }

            var result = await _authService.RegisterAsync(dto);

            if (!result.Success)
            {
                return BadRequest(new ApiResponse<object>(
                    success: false,
                    message: "Email already exists. Please use a different email address."
                ));
            }

            var userData = new
            {
                user_id = result.UserId,
                email = result.Email,
            };

            return StatusCode(201, new ApiResponse<object>(
                success: true,
                data: userData,
                message: "User registered successfully. Please login to continue."
            ));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                
                return BadRequest(new ApiResponse<object>(
                    success: false,
                    message: "Validation failed. Please check your input.",
                    errors: errors
                ));
            }

            var result = await _authService.LoginAsync(dto);

            if (result == null)
            {
                return Unauthorized(new ApiResponse<object>(
                    success: false,
                    message: "Invalid email or password. Please check your credentials and try again."
                ));
            }

            return Ok(new ApiResponse<AuthResponseDto>(
                success: true,
                data: result,
                message: "Login successful. Welcome back!"
            ));
        }
    }
}
