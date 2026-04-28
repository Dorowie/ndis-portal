using NDISPortal.API.DTOs.ServiceRecommendation;

namespace NDISPortal.API.Services
{
    public interface IServiceRecommendationService
    {
        Task<ServiceRecommendationResponseDto> GetRecommendationsAsync(ServiceRecommendationRequestDto request);
    }
}
