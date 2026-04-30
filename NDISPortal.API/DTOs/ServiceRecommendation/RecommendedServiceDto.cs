namespace NDISPortal.API.DTOs.ServiceRecommendation
{
    public class RecommendedServiceDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty; // Why this service was recommended
    }
}
