using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NDISPortal.API.DTOs.Bookings;
using NDISPortal.API.Services;
using System.Security.Claims;

namespace NDISPortal.API.Controllers
{
    [Route("api/bookings")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingsController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpPost]
        [Authorize(Roles = "Participant")]
        public async Task<IActionResult> CreateBooking([FromBody] BookingCreateDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Validation failed.",
                    errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                });
            }

            var userIdClaim = User.FindFirst("userId")?.Value;
            if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Invalid user token."
                });
            }

            var result = await _bookingService.CreateBookingAsync(userId, dto);

            return StatusCode(201, new
            {
                success = true,
                data = result,
                message = "Booking created successfully."
            });
        }

        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Coordinator")]
        public async Task<IActionResult> UpdateBookingStatus(int id, [FromBody] BookingStatusUpdateDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Validation failed.",
                    errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                });
            }

            var result = await _bookingService.UpdateBookingStatusAsync(id, dto.Status);

            if (result == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Booking not found."
                });
            }

            return Ok(new
            {
                success = true,
                data = result,
                message = "Booking status updated successfully."
            });
        }
    }
}
