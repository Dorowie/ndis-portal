using NDISPortal.API.DTOs.Dashboard;

namespace NDISPortal.API.Services;

public interface IDashboardManageService
{
    Task<List<DashboardServiceResponseDto>> GetAllServicesAsync();
    Task<DashboardServiceResponseDto?> CreateServiceAsync(DashboardServiceCreateDto dto);
    Task<DashboardServiceResponseDto?> UpdateServiceAsync(int id, DashboardServiceUpdateDto dto);
}