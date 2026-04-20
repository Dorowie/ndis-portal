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
    public class ServicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ServicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. GET /api/services - Get all active services (public)
        [HttpGet]
        [AllowAnonymous]
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

        // 2. GET /api/services/{id} - Get service by ID (public)
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetServiceById(int id)
        {
            var service = await _context.Services
                .Include(s => s.Category)
                .Where(s => s.id == id && s.is_active)
                .Select(s => new ServiceResponseDto
                {
                    Id = s.id,
                    CategoryId = s.category_id,
                    Name = s.name,
                    Description = s.description,
                    IsActive = s.is_active,
                    CategoryName = s.Category != null ? s.Category.name : string.Empty
                })
                .FirstOrDefaultAsync();

            if (service == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Service not found."
                });
            }

            return Ok(new
            {
                success = true,
                data = service
            });
        }

        // 3. POST /api/services - Create new service (Coordinator only)
        [HttpPost]
        [Authorize(Roles = "Coordinator")]
        public async Task<IActionResult> CreateService([FromBody] ServiceCreateDto dto)
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

            // Verify category exists
            var categoryExists = await _context.ServiceCategories.AnyAsync(c => c.id == dto.CategoryId);
            if (!categoryExists)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Category not found."
                });
            }

            var service = new NDISPortal.API.Models.Service
            {
                category_id = dto.CategoryId,
                name = dto.Name,
                description = dto.Description,
                is_active = true,
                created_date = DateTime.UtcNow,
                modified_date = DateTime.UtcNow
            };

            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            var response = new ServiceResponseDto
            {
                Id = service.id,
                CategoryId = service.category_id,
                Name = service.name,
                Description = service.description,
                IsActive = service.is_active,
                CategoryName = (await _context.ServiceCategories.FindAsync(service.category_id))?.name ?? string.Empty
            };

            return StatusCode(201, new
            {
                success = true,
                data = response,
                message = "Service created successfully."
            });
        }

        // 4. PUT /api/services/{id} - Update service (Coordinator only)
        [HttpPut("{id}")]
        [Authorize(Roles = "Coordinator")]
        public async Task<IActionResult> UpdateService(int id, [FromBody] ServiceUpdateDto dto)
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

            var service = await _context.Services.FindAsync(id);
            if (service == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Service not found."
                });
            }

            // Verify category exists
            var categoryExists = await _context.ServiceCategories.AnyAsync(c => c.id == dto.CategoryId);
            if (!categoryExists)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Category not found."
                });
            }

            service.category_id = dto.CategoryId;
            service.name = dto.Name;
            service.description = dto.Description;
            service.is_active = dto.IsActive;
            service.modified_date = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var response = new ServiceResponseDto
            {
                Id = service.id,
                CategoryId = service.category_id,
                Name = service.name,
                Description = service.description,
                IsActive = service.is_active,
                CategoryName = (await _context.ServiceCategories.FindAsync(service.category_id))?.name ?? string.Empty
            };

            return Ok(new
            {
                success = true,
                data = response,
                message = "Service updated successfully."
            });
        }

        // 5. DELETE /api/services/{id} - Soft delete service (Coordinator only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Coordinator")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Service not found."
                });
            }

            service.is_active = false;
            service.modified_date = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Service deleted successfully."
            });
        }
    }
}
