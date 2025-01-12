using InsurancePolicy.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace InsurancePolicy.Data;

public class ApplicationDbContext: IdentityDbContext<User>
{
    private readonly AuditingSaveChangesInterceptor _auditingSaveChangesInterceptor;
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, AuditingSaveChangesInterceptor auditingSaveChangesInterceptor): base(options)
    {
        _auditingSaveChangesInterceptor = auditingSaveChangesInterceptor;
    }
    
    public DbSet<Models.InsurancePolicy> InsurancePolicies { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<Models.InsurancePolicy>().HasQueryFilter(ip => ip.DeletedAtUtc == null);
        builder.Entity<Models.InsurancePolicy>()
            .HasOne(a => a.CreatedBy)
            .WithMany()
            .HasForeignKey(a => a.CreatedById);
        
        builder.Entity<Models.InsurancePolicy>()
            .HasOne(a => a.LastModifiedBy)
            .WithMany()
            .HasForeignKey(a => a.LastModifiedById);
        
        builder.Entity<Models.InsurancePolicy>()
            .HasIndex(ip => new { ip.PolicyNumber, ip.CreatedById })
            .HasFilter($"\"DeletedAtUtc\" IS NULL")
            .IsUnique();
    }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.AddInterceptors(_auditingSaveChangesInterceptor);
}
