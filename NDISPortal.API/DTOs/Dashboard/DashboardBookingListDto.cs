namespace NDISPortal.API.DTOs.Dashboard;

public class DashboardBookingListDto
{
    public int Id { get; set; }
    public string ParticipantName { get; set; } = string.Empty;
    public string ServiceName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public DateTime PreferredDate { get; set; }
    public string? Notes { get; set; }
    public int Status { get; set; }

    public bool CanApprove { get; set; }
    public bool CanCancel { get; set; }
}