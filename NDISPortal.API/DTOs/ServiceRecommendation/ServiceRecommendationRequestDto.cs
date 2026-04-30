using System.ComponentModel.DataAnnotations;

namespace NDISPortal.API.DTOs.ServiceRecommendation
{
    public class ServiceRecommendationRequestDto
    {
        [Required]
        public string UserSituation { get; set; } = string.Empty;

        [Required]
        public string SupportNeeds { get; set; } = string.Empty;

        public List<string>? ConversationHistory { get; set; }
    }
}
