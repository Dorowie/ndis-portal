using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NDISPortal.API.DTOs.Auth;
using NDISPortal.API.Services;

namespace NDISPortal.API.Controllers
{
    [Route("api/auth")]
    [ApiController]
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
                return BadRequest(new
                {
                    success = false,
                    message = "Validation failed.",
                    errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                });
            }

            var result = await _authService.RegisterAsync(dto);

            if (!result.Success)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Email already exists."
                });
            }

            return StatusCode(201, new
            {
                success = true,
                data = new
                {
                    userId = result.UserId,
                    email = result.Email,
                },
                message = "User registered successfully."
            });
        }
    }
}
