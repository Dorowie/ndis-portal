using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NDISPortal.API.Data;
using NDISPortal.API.DTOs;
using NDISPortal.API.DTOs.Bookings;
using NDISPortal.API.Models;
using NDISPortal.API.Services;
using System.Security.Claims;

namespace NDISPortal.API.Controllers
{
    [Route("api/bookings")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly ApplicationDbContext _context;

        public BookingsController(IBookingService bookingService, ApplicationDbContext context)
        {
            _bookingService = bookingService;
            _context = context;
        }

        // GET /api/bookings - Role-based access with optional status filter
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetBookings([FromQuery] string? status = null)
        {
            // Try multiple ways to get user ID from JWT claims
            var userIdClaim = User.FindFirst("userId")?.Value ?? 
                             User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                             User.FindFirst("sub")?.Value;
                             
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new ApiResponse<object>(
                    success: false,
                    message: "Invalid user token. Please login again."
                ));
            }

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;

            var query = _context.Bookings
                .Include(b => b.Service)
                .ThenInclude(s => s.Category)
                .Include(b => b.User)
                .AsQueryable();

            // Filter by status if provided (convert string to byte)
            if (!string.IsNullOrEmpty(status))
            {
                byte statusValue = status.ToLower() switch
                {
                    "pending" => 0,
                    "approved" => 1,
                    "cancelled" => 2,
                    _ => 0
                };
                query = query.Where(b => b.status == statusValue);
            }

            // Role-based filtering
            if (userRole == "Participant")
            {
                // Participants see only their own bookings
                query = query.Where(b => b.user_id == userId);
            }
            // Coordinators see all bookings (no additional filter needed)

            var bookings = await query
                .OrderByDescending(b => b.created_date)
                .Select(b => new
                {
                    booking_id = b.id,
                    user_id = b.user_id,
                    participant_name = b.User != null ? (b.User.first_name + " " + b.User.last_name).Trim() : "Unknown User",
                    service_id = b.service_id,
                    service_name = b.Service != null ? b.Service.name : "Unknown Service",
                    category_name = b.Service != null && b.Service.Category != null ? b.Service.Category.name : "Unknown Category",
                    preferred_date = b.booking_date,
                    status = b.status_label,
                    notes = b.notes,
                    created_date = b.created_date,
                    modified_date = b.modified_date
                })
                .ToListAsync();

            // Remove participant_name for participants
            if (userRole == "Participant")
            {
                var participantBookings = bookings.Select(b => new
                {
                    booking_id = b.booking_id,
                    service_id = b.service_id,
                    service_name = b.service_name,
                    preferred_date = b.preferred_date,
                    status = b.status,
                    notes = b.notes,
                    created_date = b.created_date,
                    modified_date = b.modified_date
                }).ToList();

                return Ok(new ApiResponse<object>(
                    success: true,
                    data: participantBookings,
                    message: "Bookings retrieved successfully.",
                    count: participantBookings.Count
                ));
            }

            return Ok(new ApiResponse<object>(
                success: true,
                data: bookings,
                message: "All bookings retrieved successfully.",
                count: bookings.Count
            ));
        }

        // POST /api/bookings - Create booking (Participant only)
        [HttpPost]
        [Authorize(Roles = "Participant")]
        public async Task<IActionResult> CreateBooking([FromBody] BookingCreateDto dto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                
                return BadRequest(new ApiResponse<object>(
                    success: false,
                    message: "Validation failed. Please check your input.",
                    errors: errors
                ));
            }

            // Try multiple ways to get user ID from JWT claims
            var userIdClaim = User.FindFirst("userId")?.Value ?? 
                             User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                             User.FindFirst("sub")?.Value;
                             
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new ApiResponse<object>(
                    success: false,
                    message: "Invalid user token. Please login again."
                ));
            }

            // Validation: Preferred date must be today or future
            if (dto.PreferredDate.Date < DateTime.UtcNow.Date)
            {
                return BadRequest(new ApiResponse<object>(
                    success: false,
                    message: "Preferred date must be today or in the future. Please select a valid date."
                ));
            }

            // Validation: Service must exist and be active
            var service = await _context.Services
                .FirstOrDefaultAsync(s => s.id == dto.ServiceId && s.is_active);
            
            if (service == null)
            {
                return BadRequest(new ApiResponse<object>(
                    success: false,
                    message: "Service not found or inactive. Please select an active service."
                ));
            }

            var result = await _bookingService.CreateBookingAsync(userId, dto);

            // Get the created booking with full details
            var createdBooking = await _context.Bookings
                .Include(b => b.Service)
                .ThenInclude(s => s.Category)
                .Where(b => b.id == result.Id)
                .Select(b => new
                {
                    booking_id = b.id,
                    service_id = b.service_id,
                    service_name = b.Service.name,
                    preferred_date = b.booking_date,
                    status = b.status_label,
                    notes = b.notes,
                    created_date = b.created_date,
                    modified_date = b.modified_date
                })
                .FirstOrDefaultAsync();

            return StatusCode(201, new ApiResponse<object>(
                success: true,
                data: createdBooking,
                message: "Booking created successfully. Your booking is now pending approval."
            ));
        }

        // PUT /api/bookings/{id}/status - Update booking status (Coordinator only)
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Coordinator")]
        public async Task<IActionResult> UpdateBookingStatus(int id, [FromBody] BookingStatusUpdateDto dto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                
                return BadRequest(new ApiResponse<object>(
                    success: false,
                    message: "Validation failed. Please check your input.",
                    errors: errors
                ));
            }

            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound(new ApiResponse<object>(
                    success: false,
                    message: "Booking not found. Please check the booking ID and try again."
                ));
            }

            // Update status and timestamp
            booking.modified_date = DateTime.UtcNow;
            booking.status = dto.Status;

            await _context.SaveChangesAsync();

            // Return updated booking
            var updatedBooking = await _context.Bookings
                .Include(b => b.Service)
                .ThenInclude(s => s.Category)
                .Include(b => b.User)
                .Where(b => b.id == id)
                .Select(b => new
                {
                    booking_id = b.id,
                    user_id = b.user_id,
                    participant_name = b.User.first_name + " " + b.User.last_name,
                    service_id = b.service_id,
                    service_name = b.Service.name,
                    category_name = b.Service.Category.name,
                    preferred_date = b.booking_date,
                    status = b.status_label,
                    notes = b.notes,
                    created_date = b.created_date,
                    modified_date = b.modified_date
                })
                .FirstOrDefaultAsync();

            return Ok(new ApiResponse<object>(
                success: true,
                data: updatedBooking,
                message: $"Booking status updated to {updatedBooking?.status} successfully."
            ));
        }

        // DELETE /api/bookings/{id} - Delete booking (Participant only, own bookings, Pending only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Participant,Coordinator")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            // Try multiple ways to get user ID from JWT claims
            var userIdClaim = User.FindFirst("userId")?.Value ?? 
                             User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                             User.FindFirst("sub")?.Value;
                             
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new ApiResponse<object>(
                    success: false,
                    message: "Invalid user token. Please login again."
                ));
            }

            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound(new ApiResponse<object>(
                    success: false,
                    message: "Booking not found. Please check the booking ID and try again."
                ));
            }

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;

            // Different rules for different roles
            if (userRole == "Participant")
            {
                // Participants can only delete their own bookings
                if (booking.user_id != userId)
                {
                    return Forbid();
                }

                // Participants can only delete Pending bookings
                if (booking.status != 0)
                {
                    return BadRequest(new ApiResponse<object>(
                        success: false,
                        message: "Can only delete bookings with Pending status. Approved or Cancelled bookings cannot be deleted."
                    ));
                }
            }
            // Coordinators can delete any booking (no additional restrictions needed)

            try
            {
                _context.Bookings.Remove(booking);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>(
                    success: false,
                    message: "Error deleting booking. Please try again.",
                    errors: new List<string> { ex.Message, ex.InnerException?.Message ?? "" }
                ));
            }
        }
    }
}
