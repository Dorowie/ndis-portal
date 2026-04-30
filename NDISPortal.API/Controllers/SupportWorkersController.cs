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
                    ServiceName = w.Service != null ? w.Service.name : "No Service"
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
                .FirstOrDefaultAsync(s => s.id == body.AssignedServiceId);

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
                phone = body.Phone,
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
                ServiceName = service.name
            };

            return CreatedAtAction(nameof(GetAll), new { id = worker.id }, response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateSupportWorkerDto body)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var worker = await _context.SupportWorkers
                .Include(w => w.Service)
                .FirstOrDefaultAsync(w => w.id == id);

            if (worker == null)
                return NotFound($"Support worker with ID {id} not found.");

            // Check if email is being changed and if new email already exists
            if (worker.email != body.Email)
            {
                var emailExists = await _context.SupportWorkers
                    .AnyAsync(w => w.email == body.Email && w.id != id);
                if (emailExists)
                    return BadRequest("Email already exists.");
            }

            // Verify service exists
            var service = await _context.Services
                .FirstOrDefaultAsync(s => s.id == body.AssignedServiceId);
            if (service == null)
                return BadRequest($"Service with ID {body.AssignedServiceId} does not exist.");

            // Update worker
            worker.first_name = body.FirstName.Trim();
            worker.last_name = body.LastName.Trim();
            worker.email = body.Email.Trim();
            worker.phone = body.Phone;
            worker.service_id = body.AssignedServiceId;
            worker.modified_date = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var response = new SupportWorkerResponseDto
            {
                Id = worker.id,
                FullName = worker.first_name + " " + worker.last_name,
                Email = worker.email,
                Phone = worker.phone,
                ServiceName = service.name
            };

            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var worker = await _context.SupportWorkers.FindAsync(id);
            if (worker == null)
                return NotFound($"Support worker with ID {id} not found.");

            _context.SupportWorkers.Remove(worker);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Support worker deleted successfully." });
        }
    }
}