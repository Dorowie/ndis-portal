using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NDISPortal.API.DTOs.Dashboard;
using NDISPortal.API.Services;

namespace NDISPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Coordinator")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    // GET /api/dashboard
    [HttpGet]
    public async Task<IActionResult> GetDashboard()
    {
        var result = await _dashboardService.GetDashboardAsync();
        return Ok(result);
    }

    // PUT /api/dashboard/bookings/{id}/status
    [HttpPut("bookings/{id}/status")]
    public async Task<IActionResult> UpdateBookingStatus(int id, [FromBody] UpdateBookingStatusDto dto)
    {
        var result = await _dashboardService.UpdateBookingStatusAsync(id, dto.Status);

        if (result == null)
            return BadRequest(new { message = "Invalid booking or already processed." });

        return Ok(result);
    }
}