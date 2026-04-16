using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NDISPortal.API.Data;
using NDISPortal.API.Models;

namespace NDISPortal.API.Controllers
{
    [Route("api/support-workers")]
    [ApiController]
    public class SupportWorkersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SupportWorkersController(ApplicationDbContext context)
        {
            _context = context;
        }

        
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var workers = await _context.SupportWorkers
                .Include(w => w.Service)
                .Select(w => new
                {
                    w.Id,
                    FullName = w.FirstName + " " + w.LastName,
                    w.Email,
                    w.Phone,
                    ServiceName = w.Service != null ? w.Service.Name : ""
                })
                .ToListAsync();

            return Ok(workers);
        }

        
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSupportWorkerRequest body)
        {
            if (body == null)
                return BadRequest("Invalid data");

            
            var service = await _context.Services.FindAsync(body.AssignedServiceId);
            if (service == null)
                return BadRequest("Service not found");

            
            var names = body.FullName.Trim().Split(' ', 2);

            var worker = new SupportWorker
            {
                FirstName = names.Length > 0 ? names[0] : "",
                LastName = names.Length > 1 ? names[1] : "",
                Email = body.Email ?? "",
                Phone = body.Phone ?? "",
                ServiceId = body.AssignedServiceId,
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow
            };

            _context.SupportWorkers.Add(worker);
            await _context.SaveChangesAsync();

            
            return StatusCode(201, new
            {
                worker.Id,
                FullName = worker.FirstName + " " + worker.LastName,
                worker.Email,
                worker.Phone,
                ServiceName = service.Name
            });
        }
    }

    
    public class CreateSupportWorkerRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public int AssignedServiceId { get; set; }
    }
}