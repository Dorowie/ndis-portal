using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NDISPortal.API.Data;
using NDISPortal.API.Models;
using NDISPortal.API.DTOs.SupportWorker;

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
                .Select(w => new SupportWorkerResponseDto
                {
                    Id = w.id,
                    FullName = w.first_name + " " + w.last_name,
                    Email = w.email,
                    Phone = w.phone,
                    ServiceName = w.Service != null ? w.Service.Name : "No Service"
                })
                .ToListAsync();

            return Ok(workers);
        }

        
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSupportWorkerDto body)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var service = await _context.Services
                .FirstOrDefaultAsync(s => s.Id == body.AssignedServiceId);

            if (service == null)
                return BadRequest($"Service with ID {body.AssignedServiceId} does not exist.");

            var exists = await _context.SupportWorkers
                .AnyAsync(w => w.email == body.Email);

            if (exists)
                return BadRequest("Email already exists.");

            var worker = new SupportWorker
            {
                first_name = body.FirstName.Trim(),
                last_name = body.LastName.Trim(),
                email = body.Email.Trim(),
                phone    = body.Phone,
                service_id = body.AssignedServiceId,
                created_date = DateTime.UtcNow,
                modified_date = DateTime.UtcNow
            };

            _context.SupportWorkers.Add(worker);
            await _context.SaveChangesAsync();

            var response = new SupportWorkerResponseDto
            {
                Id = worker.id,
                FullName = worker.first_name + " " + worker.last_name,
                Email = worker.email,
                Phone = worker.phone,
                ServiceName = service.Name
            };

            return CreatedAtAction(nameof(GetAll), new { id = worker.id }, response);
        }
    }
}