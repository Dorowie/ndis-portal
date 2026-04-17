namespace NDISPortal.API.DTOs.SupportWorker
{
    public class CreateSupportWorkerDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public int AssignedServiceId { get; set; }
    }
}