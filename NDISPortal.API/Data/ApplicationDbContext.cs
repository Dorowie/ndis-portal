using Microsoft.EntityFrameworkCore;
using NDISPortal.API.Models;

namespace NDISPortal.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<SupportWorker> SupportWorkers { get; set; }

       
        public DbSet<Service> Services { get; set; }
    }
}