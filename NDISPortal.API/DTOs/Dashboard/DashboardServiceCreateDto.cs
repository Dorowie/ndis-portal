using System.ComponentModel.DataAnnotations;

namespace NDISPortal.API.DTOs.Dashboard;

public class DashboardServiceCreateDto
{
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public int CategoryId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Description { get; set; } = string.Empty;
}