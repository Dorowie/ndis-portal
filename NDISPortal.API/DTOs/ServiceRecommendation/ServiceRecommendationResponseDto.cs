namespace NDISPortal.API.DTOs.ServiceRecommendation
{
    public class ServiceRecommendationResponseDto
    {
        public List<RecommendedServiceDto> Recommendations { get; set; } = new();
        public string Summary { get; set; } = string.Empty; // Brief summary of the analysis
    }
}
