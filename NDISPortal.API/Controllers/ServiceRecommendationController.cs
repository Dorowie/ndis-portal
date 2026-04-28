using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NDISPortal.API.DTOs.ServiceRecommendation;
using NDISPortal.API.Services;

namespace NDISPortal.API.Controllers
{
    [Route("api/ai/recommend-services")]
    [ApiController]
    [Authorize]
    public class ServiceRecommendationController : ControllerBase
    {
        private readonly IServiceRecommendationService _serviceRecommendationService;

        public ServiceRecommendationController(IServiceRecommendationService serviceRecommendationService)
        {
            _serviceRecommendationService = serviceRecommendationService;
        }

        [HttpPost]
        public async Task<IActionResult> GetRecommendations([FromBody] ServiceRecommendationRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    status = 400,
                    message = "Invalid request body."
                });
            }

            if (string.IsNullOrWhiteSpace(request.UserSituation))
            {
                return BadRequest(new
                {
                    status = 400,
                    message = "User situation cannot be empty."
                });
            }

            if (string.IsNullOrWhiteSpace(request.SupportNeeds))
            {
                return BadRequest(new
                {
                    status = 400,
                    message = "Support needs cannot be empty."
                });
            }

            try
            {
                var result = await _serviceRecommendationService.GetRecommendationsAsync(request);

                return Ok(new
                {
                    status = 200,
                    data = result
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    status = 400,
                    message = ex.Message
                });
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(503, new
                {
                    status = 503,
                    message = ex.Message
                });
            }
            catch
            {
                return StatusCode(503, new
                {
                    status = 503,
                    message = "Service recommendation is temporarily unavailable."
                });
            }
        }
    }
}
