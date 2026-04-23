using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Text.Json;

namespace NDISPortal.API.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;

        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            var response = new
            {
                success = false,
                message = "An error occurred while processing your request.",
                errors = new List<string>()
            };

            switch (exception)
            {
                case DbUpdateException dbEx:
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    response = new
                    {
                        success = false,
                        message = "Database error occurred. Please check your input and try again.",
                        errors = new List<string> { dbEx.InnerException?.Message ?? dbEx.Message }
                    };
                    _logger.LogError(dbEx, "Database error occurred");
                    break;

                case UnauthorizedAccessException:
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    response = new
                    {
                        success = false,
                        message = "You are not authorized to perform this action.",
                        errors = new List<string>()
                    };
                    _logger.LogWarning("Unauthorized access attempt");
                    break;

                case KeyNotFoundException:
                    context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                    response = new
                    {
                        success = false,
                        message = "The requested resource was not found.",
                        errors = new List<string> { exception.Message }
                    };
                    _logger.LogWarning("Resource not found: {Message}", exception.Message);
                    break;

                case ArgumentException argEx:
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    response = new
                    {
                        success = false,
                        message = "Invalid input provided.",
                        errors = new List<string> { argEx.Message }
                    };
                    _logger.LogWarning("Invalid input: {Message}", argEx.Message);
                    break;

                default:
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    response = new
                    {
                        success = false,
                        message = "An unexpected error occurred. Please try again later.",
                        errors = new List<string>()
                    };
                    _logger.LogError(exception, "Unhandled exception occurred");
                    break;
            }

            var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
            });

            await context.Response.WriteAsync(jsonResponse);
        }
    }

    // Extension method for easy registration
    public static class ErrorHandlingMiddlewareExtensions
    {
        public static IApplicationBuilder UseGlobalErrorHandling(this IApplicationBuilder app)
        {
            return app.UseMiddleware<ErrorHandlingMiddleware>();
        }
    }
}
