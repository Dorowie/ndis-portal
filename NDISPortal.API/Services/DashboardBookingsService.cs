using Microsoft.EntityFrameworkCore;
using NDISPortal.API.Data;
using NDISPortal.API.DTOs.Bookings;
using NDISPortal.API.DTOs.Dashboard;

namespace NDISPortal.API.Services;

public class DashboardBookingsService : IDashboardBookingsService
{
    private readonly ApplicationDbContext _context;

    public DashboardBookingsService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<DashboardBookingListDto>> GetAllBookingsAsync(int? status)
    {
        var query = _context.Bookings
            .Include(b => b.User)
            .Include(b => b.Service)
            .ThenInclude(s => s!.Category)
            .AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(b => b.status == status.Value);
        }

        return await query
            .OrderByDescending(b => b.id)
            .Select(b => new DashboardBookingListDto
            {
                Id = b.id,
                ParticipantName = b.User != null
                    ? b.User.first_name + " " + b.User.last_name
                    : "",
                ServiceName = b.Service != null
                    ? b.Service.name
                    : "",
                CategoryName = b.Service != null && b.Service.Category != null
                    ? b.Service.Category.name
                    : "",
                PreferredDate = b.booking_date,
                Notes = b.notes,
                Status = b.status,
                CanApprove = b.status == 0,
                CanCancel = b.status == 0
            })
            .ToListAsync();
    }

    public async Task<DashboardBookingResponseDto?> UpdateBookingStatusAsync(int bookingId, int status)
    {
        var booking = await _context.Bookings
            .Include(b => b.User)
            .Include(b => b.Service)
            .FirstOrDefaultAsync(b => b.id == bookingId);

        if (booking == null)
            return null;

        if (booking.status != 0)
            return null;

        if (status != 1 && status != 2)
            return null;

        booking.status = (byte)status;
        booking.modified_date = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new DashboardBookingResponseDto
        {
            Id = booking.id,
            ParticipantName = booking.User != null
                ? booking.User.first_name + " " + booking.User.last_name
                : "",
            ServiceName = booking.Service?.name ?? "",
            PreferredDate = booking.booking_date,
            Status = booking.status
        };
    }
}