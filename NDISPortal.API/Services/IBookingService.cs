using NDISPortal.API.DTOs.Bookings;

namespace NDISPortal.API.Services
{
    public interface IBookingService
    {
        Task<BookingResponseDto> CreateBookingAsync(int userId, BookingCreateDto dto);
        Task<BookingResponseDto?> UpdateBookingStatusAsync(int bookingId, string status);
        Task<BookingResponseDto?> GetBookingByIdAsync(int bookingId);
    }
}
