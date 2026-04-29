namespace NDISPortal.API.DTOs.Dashboard;

public class DashboardResponseDto
{
    public int TotalBookings { get; set; }
    public int PendingBookings { get; set; }
    public int ApprovedBookings { get; set; }
    public int CancelledBookings { get; set; }

    public List<RecentBookingDto> RecentBookings { get; set; } = new();
}