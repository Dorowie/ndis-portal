using Microsoft.EntityFrameworkCore;
using NDISPortal.API.Data;
using NDISPortal.API.DTOs.Bookings;
using NDISPortal.API.Models;

namespace NDISPortal.API.Services
{
    public class BookingService : IBookingService
    {
        private readonly ApplicationDbContext _context;

        public BookingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<BookingResponseDto> CreateBookingAsync(int userId, BookingCreateDto dto)
        {
            var booking = new Booking
            {
                user_id = userId,
                service_id = dto.ServiceId,
                booking_date = dto.BookingDate,
                notes = dto.Notes,
                status = 0,
                created_date = DateTime.UtcNow,
                modified_date = DateTime.UtcNow
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return await MapToResponseDto(booking);
        }

        public async Task<BookingResponseDto?> UpdateBookingStatusAsync(int bookingId, byte status)
        {
            var booking = await _context.Bookings
                .Include(b => b.Service)
                .ThenInclude(s => s!.Category)
                .FirstOrDefaultAsync(b => b.id == bookingId);

            if (booking == null)
            {
                return null;
            }

            booking.status = status;
            booking.modified_date = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await MapToResponseDto(booking);
        }

        public async Task<BookingResponseDto?> GetBookingByIdAsync(int bookingId)
        {
            var booking = await _context.Bookings
                .Include(b => b.Service)
                .ThenInclude(s => s!.Category)
                .FirstOrDefaultAsync(b => b.id == bookingId);

            if (booking == null)
            {
                return null;
            }

            return await MapToResponseDto(booking);
        }

        private async Task<BookingResponseDto> MapToResponseDto(Booking booking)
        {
            var service = booking.Service ?? await _context.Services
                .Include(s => s.Category)
                .FirstOrDefaultAsync(s => s.id == booking.service_id);

            return new BookingResponseDto
            {
                Id = booking.id,
                UserId = booking.user_id,
                ServiceId = booking.service_id,
                BookingDate = booking.booking_date,
                Notes = booking.notes,
                Status = booking.status,
                CreatedDate = booking.created_date,
                ModifiedDate = booking.modified_date,
                ServiceName = service?.name,
                CategoryId = service?.category_id,
                CategoryName = service?.Category?.name
            };
        }
    }
}
