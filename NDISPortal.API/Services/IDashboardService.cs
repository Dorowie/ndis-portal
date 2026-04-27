using NDISPortal.API.DTOs.Dashboard;
using NDISPortal.API.DTOs.Bookings;

namespace NDISPortal.API.Services;

public interface IDashboardService
{
    Task<DashboardResponseDto> GetDashboardAsync();
    Task<DashboardBookingResponseDto?> UpdateBookingStatusAsync(int bookingId, int status);

    Task<List<DashboardBookingListDto>> GetAllBookingsAsync(int? status);
}