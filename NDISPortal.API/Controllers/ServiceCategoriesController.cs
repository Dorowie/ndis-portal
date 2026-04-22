using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NDISPortal.API.Data;
using NDISPortal.API.DTOs;
using NDISPortal.API.DTOs.Services;

namespace NDISPortal.API.Controllers
{
    [Route("api/categories")]
    [ApiController]
    [AllowAnonymous]
    public class ServiceCategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ServiceCategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            var category = await _context.ServiceCategories
                .Include(c => c.Services)
                .Where(c => c.id == id)
                .Select(c => new ServiceCategoryResponseDto
                {
                    Id = c.id,
                    Name = c.name,
                    Services = c.Services
                        .Where(s => s.is_active)
                        .Select(s => new ServiceSummaryDto
                        {
                            Id = s.id,
                            Name = s.name,
                            Description = s.description,
                            IsActive = s.is_active
                        })
                        .ToList()
                })
                .FirstOrDefaultAsync();

            if (category == null)
            {
                return NotFound(new ApiResponse<object>(
                    success: false,
                    message: "Category not found. Please check the category ID and try again."
                ));
            }

            return Ok(new ApiResponse<ServiceCategoryResponseDto>(
                success: true,
                data: category,
                message: "Category retrieved successfully."
            ));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _context.ServiceCategories
                .OrderBy(c => c.id)
                .Select(c => new
                {
                    category_id = c.id,
                    name = c.name
                })
                .ToListAsync();

            return Ok(new ApiResponse<object>(
                success: true,
                data: categories,
                message: "Categories retrieved successfully.",
                count: categories.Count
            ));
        }
    }
}
