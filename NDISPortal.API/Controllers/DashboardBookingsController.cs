using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NDISPortal.API.DTOs;
using NDISPortal.API.DTOs.Dashboard;
using NDISPortal.API.Services;

namespace NDISPortal.API.Controllers;

[ApiController]
[Route("api/dashboard/bookings")]
[Authorize(Roles = "Coordinator")]
public class DashboardBookingsController : ControllerBase
{
    private readonly IDashboardBookingsService _dashboardBookingsService;

    public DashboardBookingsController(IDashboardBookingsService dashboardBookingsService)
    {
        _dashboardBookingsService = dashboardBookingsService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllBookings([FromQuery] int? status)
    {
        if (status.HasValue && status.Value is < 0 or > 2)
        {
            return BadRequest(new ApiResponse<object>(
                success: false,
                message: "Invalid status filter. Use 0, 1, or 2 only."
            ));
        }

        var bookings = await _dashboardBookingsService.GetAllBookingsAsync(status);

        return Ok(new ApiResponse<List<DashboardBookingListDto>>(
            success: true,
            data: bookings,
            message: "Bookings retrieved successfully.",
            count: bookings.Count
        ));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBookingStatus(int id, [FromBody] UpdateBookingStatusDto dto)
    {
        var result = await _dashboardBookingsService.UpdateBookingStatusAsync(id, dto.Status);

        if (result == null)
        {
            return BadRequest(new ApiResponse<object>(
                success: false,
                message: "Invalid booking or booking is already processed."
            ));
        }

        return Ok(new ApiResponse<DashboardBookingResponseDto>(
            success: true,
            data: result,
            message: "Booking status updated successfully."
        ));
    }
}