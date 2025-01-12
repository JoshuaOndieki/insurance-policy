using System.Security.Claims;
using InsurancePolicy.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace InsurancePolicy.Data;

public class AuditingSaveChangesInterceptor : SaveChangesInterceptor
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    public AuditingSaveChangesInterceptor(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
    {
        ApplyAuditing(eventData);
        return base.SavingChanges(eventData, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        ApplyAuditing(eventData);
        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }
    
    private void ApplyAuditing(DbContextEventData eventData)
    {
        var dbContext = eventData.Context;
        var entries = dbContext.ChangeTracker.Entries<Auditable>();
        foreach (var entry in entries)
        {
            var userId = _httpContextAccessor.HttpContext?.User?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
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
    }
}
