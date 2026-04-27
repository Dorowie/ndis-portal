using Microsoft.EntityFrameworkCore;
using NDISPortal.API.Data;
using NDISPortal.API.DTOs.Dashboard;

namespace NDISPortal.API.Services;

public class DashboardManageService : IDashboardManageService
{
    private readonly ApplicationDbContext _context;

    public DashboardManageService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<DashboardServiceResponseDto>> GetAllServicesAsync()
    {
        return await _context.Services
            .Include(s => s.Category)
            .OrderBy(s => s.id)
            .Select(s => new DashboardServiceResponseDto
            {
                Id = s.id,
                CategoryId = s.category_id,
                Name = s.name,
                Description = s.description,
                IsActive = s.is_active,
                CategoryName = s.Category != null ? s.Category.name : string.Empty
            })
            .ToListAsync();
    }

    public async Task<DashboardServiceResponseDto?> CreateServiceAsync(DashboardServiceCreateDto dto)
    {
        var category = await _context.ServiceCategories
            .FirstOrDefaultAsync(c => c.id == dto.CategoryId);

        if (category == null)
            return null;

        var service = new NDISPortal.API.Models.Service
        {
            name = dto.Name,
            category_id = dto.CategoryId,
            description = dto.Description,
            is_active = true,
            created_date = DateTime.UtcNow,
            modified_date = DateTime.UtcNow
        };

        _context.Services.Add(service);
        await _context.SaveChangesAsync();

        return new DashboardServiceResponseDto
        {
            Id = service.id,
            CategoryId = service.category_id,
            Name = service.name,
            Description = service.description,
            IsActive = service.is_active,
            CategoryName = category.name
        };
    }

    public async Task<DashboardServiceResponseDto?> UpdateServiceAsync(int id, DashboardServiceUpdateDto dto)
    {
        var service = await _context.Services
            .Include(s => s.Category)
            .FirstOrDefaultAsync(s => s.id == id);

        if (service == null)
            return null;

        var category = await _context.ServiceCategories
            .FirstOrDefaultAsync(c => c.id == dto.CategoryId);

        if (category == null)
            return null;

        service.name = dto.Name;
        service.category_id = dto.CategoryId;
        service.description = dto.Description;
        service.is_active = dto.IsActive;
        service.modified_date = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new DashboardServiceResponseDto
        {
            Id = service.id,
            CategoryId = service.category_id,
            Name = service.name,
            Description = service.description,
            IsActive = service.is_active,
            CategoryName = category.name
        };
    }
}