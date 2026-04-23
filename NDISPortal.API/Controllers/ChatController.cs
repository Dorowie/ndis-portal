using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NDISPortal.API.DTOs.Chat;
using NDISPortal.API.Services;

namespace NDISPortal.API.Controllers
{
    [Route("api/chat")]
    [ApiController]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] ChatRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    status = 400,
                    message = "Invalid request body."
                });
            }

            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(new
                {
                    status = 400,
                    message = "Message cannot be empty."
                });
            }

            try
            {
                var result = await _chatService.GetReplyAsync(request);

                return Ok(new
                {
                    status = 200,
                    reply = result.Reply
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
                    message = "Chat service is temporarily unavailable."
                });
            }
        }
    }
}