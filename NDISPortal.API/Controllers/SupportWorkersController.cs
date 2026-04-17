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
                    Id = w.Id,
                    FullName = w.FirstName + " " + w.LastName,
                    Email = w.Email,
                    Phone = w.Phone,
                    ServiceName = w.Service != null ? w.Service.Name : ""
                })
                .ToListAsync();

            return Ok(workers);
        }

        
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSupportWorkerDto body)
        {
            
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

           
            var service = await _context.Services.FindAsync(body.AssignedServiceId);
            if (service == null)
                return BadRequest("Service not found");

            var worker = new SupportWorker
            {
                FirstName = body.FirstName,
                LastName = body.LastName,
                Email = body.Email,
                Phone = body.Phone,
                ServiceId = body.AssignedServiceId,
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow
            };

            _context.SupportWorkers.Add(worker);
            await _context.SaveChangesAsync();

            
            var response = new SupportWorkerResponseDto
            {
                Id = worker.Id,
                FullName = worker.FirstName + " " + worker.LastName,
                Email = worker.Email,
                Phone = worker.Phone,
                ServiceName = service.Name
            };

            return StatusCode(201, response);
        }
    }
}