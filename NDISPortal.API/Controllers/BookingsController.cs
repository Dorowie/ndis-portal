using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NDISPortal.API.Data;
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
                return Unauthorized(new
                {
                    success = false,
                    message = "Invalid user token - userId claim not found."
                });
            }

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;

            var query = _context.Bookings
                .Include(b => b.Service)
                .ThenInclude(s => s.Category)
                .Include(b => b.User)
                .AsQueryable();

            // Filter by status if provided
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(b => b.status_label == status);
            }

            // Role-based filtering
            if (userRole == "Participant")
            {
                // Participants see only their own bookings
                query = query.Where(b => b.user_id == userId);
            }
            // Coordinators see all bookings (no additional filter needed)

            if (userRole == "Participant")
            {
                // Participant response: only their own bookings
                var participantBookings = await query
                    .OrderByDescending(b => b.created_date)
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
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = participantBookings,
                    count = participantBookings.Count
                });
            }
            else
            {
                // Coordinator response: all bookings with participant names
                var coordinatorBookings = await query
                    .OrderByDescending(b => b.created_date)
                    .Select(b => new
                    {
                        booking_id = b.id,
                        user_id = b.user_id,
                        participant_name = (b.User.first_name + " " + b.User.last_name).Trim(),
                        service_id = b.service_id,
                        service_name = b.Service.name,
                        category_name = b.Service.Category.name,
                        preferred_date = b.booking_date,
                        status = b.status_label,
                        notes = b.notes,
                        created_date = b.created_date,
                        modified_date = b.modified_date
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = coordinatorBookings,
                    count = coordinatorBookings.Count
                });
            }
        }

        // POST /api/bookings - Create booking (Participant only)
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

            // Try multiple ways to get user ID from JWT claims
            var userIdClaim = User.FindFirst("userId")?.Value ?? 
                             User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                             User.FindFirst("sub")?.Value;
                             
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Invalid user token - userId claim not found."
                });
            }

            // Validation: Preferred date must be today or future
            if (dto.PreferredDate.Date < DateTime.UtcNow.Date)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Preferred date must be today or in the future."
                });
            }

            // Validation: Service must exist and be active
            var service = await _context.Services
                .FirstOrDefaultAsync(s => s.id == dto.ServiceId && s.is_active);
            
            if (service == null)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Service not found or inactive."
                });
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

            return StatusCode(201, new
            {
                success = true,
                data = createdBooking,
                message = "Booking created successfully."
            });
        }

        // PUT /api/bookings/{id}/status - Update booking status (Coordinator only)
        [HttpPut("{id}/status")]
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

            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Booking not found."
                });
            }

            // Update status and timestamp
            booking.status_label = dto.Status;
            booking.modified_date = DateTime.UtcNow;

            // Convert string status to byte for database
            booking.status = dto.Status switch
            {
                "Approved" => (byte)1,
                "Cancelled" => (byte)2,
                _ => (byte)0 // Pending
            };

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

            return Ok(new
            {
                success = true,
                data = updatedBooking,
                message = "Booking status updated successfully."
            });
        }

        // DELETE /api/bookings/{id} - Delete booking (Participant only, own bookings, Pending only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Participant")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            // Try multiple ways to get user ID from JWT claims
            var userIdClaim = User.FindFirst("userId")?.Value ?? 
                             User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                             User.FindFirst("sub")?.Value;
                             
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Invalid user token - userId claim not found."
                });
            }

            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Booking not found."
                });
            }

            // Check if booking belongs to the participant
            if (booking.user_id != userId)
            {
                return Forbid();
            }

            // Check if booking is still Pending
            if (booking.status_label != "Pending")
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Can only delete bookings with Pending status."
                });
            }

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
