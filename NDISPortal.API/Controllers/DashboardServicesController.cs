using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NDISPortal.API.DTOs;
using NDISPortal.API.DTOs.Dashboard;
using NDISPortal.API.Services;

namespace NDISPortal.API.Controllers;

[ApiController]
[Route("api/dashboard/services")]
[Authorize(Roles = "Coordinator")]
public class DashboardServicesController : ControllerBase
{
    private readonly IDashboardManageService _dashboardManageService;

    public DashboardServicesController(IDashboardManageService dashboardManageService)
    {
        _dashboardManageService = dashboardManageService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllServices()
    {
        var services = await _dashboardManageService.GetAllServicesAsync();

        return Ok(new ApiResponse<List<DashboardServiceResponseDto>>(
            success: true,
            data: services,
            message: "Services retrieved successfully.",
            count: services.Count
        ));
    }

    [HttpPost]
    public async Task<IActionResult> CreateService([FromBody] DashboardServiceCreateDto dto)
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

        var result = await _dashboardManageService.CreateServiceAsync(dto);

        if (result == null)
        {
            return BadRequest(new ApiResponse<object>(
                success: false,
                message: "Category not found. Please select a valid category."
            ));
        }

        return StatusCode(201, new ApiResponse<DashboardServiceResponseDto>(
            success: true,
            data: result,
            message: "Service created successfully."
        ));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateService(int id, [FromBody] DashboardServiceUpdateDto dto)
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

        var result = await _dashboardManageService.UpdateServiceAsync(id, dto);

        if (result == null)
        {
            return NotFound(new ApiResponse<object>(
                success: false,
                message: "Service or category not found."
            ));
        }

        return Ok(new ApiResponse<DashboardServiceResponseDto>(
            success: true,
            data: result,
            message: "Service updated successfully."
        ));
    }
}