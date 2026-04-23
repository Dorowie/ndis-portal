using System.ComponentModel.DataAnnotations;

namespace NDISPortal.API.DTOs.Chat
{
    public class ChatRequestDto
    {
        [Required]
        public string Message { get; set; } = string.Empty;

        public List<ChatMessageDto>? ConversationHistory { get; set; }
    }
}