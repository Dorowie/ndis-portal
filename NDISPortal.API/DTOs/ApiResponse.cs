using System.Text.Json.Serialization;

namespace NDISPortal.API.DTOs
{
    // Generic response wrapper for all API endpoints
    public class ApiResponse<T>
    {
        [JsonPropertyName("success")]
        public bool Success { get; set; }

        [JsonPropertyName("data")]
        public T? Data { get; set; }

        [JsonPropertyName("message")]
        public string Message { get; set; } = string.Empty;

        [JsonPropertyName("count")]
        public int? Count { get; set; }

        [JsonPropertyName("errors")]
        public List<string>? Errors { get; set; }

        // Constructor for success with data
        public ApiResponse(bool success, T data, string message, int? count = null)
        {
            Success = success;
            Data = data;
            Message = message;
            Count = count;
        }

        // Constructor for error responses
        public ApiResponse(bool success, string message, List<string>? errors = null)
        {
            Success = success;
            Message = message;
            Errors = errors;
        }
    }

    // Non-generic version for responses without data
    public class ApiResponse
    {
        [JsonPropertyName("success")]
        public bool Success { get; set; }

        [JsonPropertyName("message")]
        public string Message { get; set; } = string.Empty;

        [JsonPropertyName("errors")]
        public List<string>? Errors { get; set; }

        public ApiResponse(bool success, string message, List<string>? errors = null)
        {
            Success = success;
            Message = message;
            Errors = errors;
        }
    }
}
