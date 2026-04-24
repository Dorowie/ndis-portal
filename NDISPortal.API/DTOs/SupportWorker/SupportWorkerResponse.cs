namespace NDISPortal.API.DTOs.SupportWorker
{
    public class SupportWorkerResponseDto
    {
        public int Id { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string? Phone { get; set; }

        public string ServiceName { get; set; } = string.Empty;
    }
}