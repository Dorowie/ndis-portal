namespace NDISPortal.API.DTOs.Dashboard;

public class RecentBookingDto
{
    public int Id { get; set; }
    public string ParticipantName { get; set; } = string.Empty;
    public string ServiceName { get; set; } = string.Empty;
    public DateTime PreferredDate { get; set; }
    public int Status { get; set; }

}