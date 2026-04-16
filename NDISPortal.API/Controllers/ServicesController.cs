using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NDISPortal.API.Data;
using NDISPortal.API.DTOs.Services;

namespace NDISPortal.API.Controllers
{
    [Route("api/services")]
    [ApiController]
    [AllowAnonymous]
    public class ServicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ServicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetServices()
        {
            var services = await _context.Services
                .Include(s => s.Category)
                .Where(s => s.is_active)
                .OrderBy(s => s.id)
                .Select(s => new ServiceResponseDto
                {
                    Id = s.id,
                    CategoryId = s.category_id,
                    Name = s.name,
                    Description = s.description,
                    IsActive = s.is_active,
                    CategoryName = s.Category != null ? s.Category.name : string.Empty
                })
                .ToListAsync();

            return Ok(new
            {
                success = true,
                data = services,
                count = services.Count
            });
        }
    }
}
