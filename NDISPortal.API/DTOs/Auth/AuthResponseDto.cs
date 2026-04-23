using System.Text.Json.Serialization;

namespace NDISPortal.API.DTOs.Auth
{
    public class AuthResponseDto
    {

        [JsonPropertyName("token")]
        public string Token { get; set; } = string.Empty;
    }
}
