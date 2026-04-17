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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            
            modelBuilder.Entity<SupportWorker>().ToTable("support_workers");
            modelBuilder.Entity<Service>().ToTable("services");

           
            modelBuilder.Entity<SupportWorker>()
                .HasOne(sw => sw.Service)
                .WithMany()
                .HasForeignKey(sw => sw.service_id)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}