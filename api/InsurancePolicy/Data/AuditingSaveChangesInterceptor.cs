using System.Security.Claims;
using InsurancePolicy.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace InsurancePolicy.Data;

public class AuditingSaveChangesInterceptor : SaveChangesInterceptor
{
    private readonly ClaimsPrincipal? _claimsPrincipal;
    public AuditingSaveChangesInterceptor(ClaimsPrincipal? claimsPrincipal)
    {
        _claimsPrincipal = claimsPrincipal;
    }
    
    public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
    {
        var dbContext = eventData.Context;
        var entries = dbContext.ChangeTracker.Entries<Auditable>();
        foreach (var entry in entries)
        {
            var userId = _claimsPrincipal?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Property(e => e.CreatedAtUtc).CurrentValue = DateTime.UtcNow;
                    entry.Property(e => e.CreatedById).CurrentValue = userId;
                    break;
                case EntityState.Modified:
                    entry.Property(p => p.LastModifiedAtUtc).CurrentValue = DateTime.UtcNow;
                    entry.Property(p => p.LastModifiedById).CurrentValue = userId;
                    break;
            }
        }
        return base.SavingChanges(eventData, result);
    }
}
