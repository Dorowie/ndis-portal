using Microsoft.EntityFrameworkCore;
using NDISPortal.API.Data;
using NDISPortal.API.DTOs.Bookings;
using NDISPortal.API.DTOs.Dashboard;

namespace NDISPortal.API.Services;

public class DashboardService : IDashboardService
{
    private readonly ApplicationDbContext _context;

    public DashboardService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardResponseDto> GetDashboardAsync()
    {
        var bookings = _context.Bookings
            .Include(b => b.User)
            .Include(b => b.Service)
            .AsQueryable();

        var recentBookings = await bookings
            .OrderByDescending(b => b.id)
            .Take(10)
            .Select(b => new RecentBookingDto
            {
                Id = b.id,
                ParticipantName = b.User != null ? b.User.first_name +" "+  b.User.last_name : "",
                ServiceName = b.Service != null ? b.Service.name : "",
                PreferredDate = b.booking_date,
                Status = b.status,

                CanApprove = b.status == 0,
                CanCancel = b.status == 0
            })
            .ToListAsync();

        return new DashboardResponseDto
        {
            TotalBookings = await bookings.CountAsync(),
            PendingBookings = await bookings.CountAsync(b => b.status == 0),
            ApprovedBookings = await bookings.CountAsync(b => b.status == 1),
            CancelledBookings = await bookings.CountAsync(b => b.status == 2),
            RecentBookings = recentBookings
        };
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
            ParticipantName = booking.User?.first_name +" "+ booking.User?.last_name ?? "",
            ServiceName = booking.Service?.name ?? "",
            PreferredDate = booking.booking_date,
            Status = booking.status
        };
    }
}