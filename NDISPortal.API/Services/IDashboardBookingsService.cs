using NDISPortal.API.DTOs.Bookings;
using NDISPortal.API.DTOs.Dashboard;

namespace NDISPortal.API.Services;

public interface IDashboardBookingsService
{
    Task<List<DashboardBookingListDto>> GetAllBookingsAsync(int? status);
    Task<DashboardBookingResponseDto?> UpdateBookingStatusAsync(int bookingId, int status);
}