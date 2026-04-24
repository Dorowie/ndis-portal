using NDISPortal.API.DTOs.Chat;

namespace NDISPortal.API.Services
{
    public interface IChatService
    {
        Task<ChatResponseDto> GetReplyAsync(ChatRequestDto request);
    }
}