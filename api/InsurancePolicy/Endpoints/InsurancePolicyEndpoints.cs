using System.Security.Claims;
using InsurancePolicy.Data;
using Microsoft.EntityFrameworkCore;

namespace InsurancePolicy.Endpoints;

public static class InsurancePolicyEndpoints
{
    public static RouteGroupBuilder MapInsurancePolicyEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapGet("/", async (ClaimsPrincipal claimsPrincipal, ApplicationDbContext dbContext) =>
        {
            var userId = claimsPrincipal?.Claims?
                .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Results.Unauthorized();

            var policies = await dbContext.InsurancePolicies
                .Where(ip => ip.CreatedById.Equals(userId))
                .ToListAsync();

            return Results.Ok(policies);
        });

        builder.MapGet("/{id:guid}", async (Guid id, ClaimsPrincipal claimsPrincipal, ApplicationDbContext dbContext) =>
        {
            var userId = claimsPrincipal?.Claims?
                .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Results.Unauthorized();

            var policy = await dbContext.InsurancePolicies
                .FirstOrDefaultAsync(ip => ip.Id.Equals(id) && ip.CreatedById.Equals(userId));

            return policy != null ? Results.Ok(policy) : Results.NotFound();
        });

        builder.MapPost("/", async (InsurancePolicyRequest policyRequest, ClaimsPrincipal claimsPrincipal, ApplicationDbContext dbContext) =>
        {
            var userId = claimsPrincipal?.Claims?
                .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Results.Unauthorized();
            
            var policyWithNumber = dbContext.InsurancePolicies
                .FirstOrDefault(ip => ip.Id.Equals(policyRequest.PolicyNumber) && ip.CreatedById.Equals(userId));

            if (policyWithNumber != null) return Results.Conflict($"Policy number {policyRequest.PolicyNumber} already exists.");
            
            var policy = new Models.InsurancePolicy()
            {
                PolicyNumber = policyRequest.PolicyNumber,
                HolderName = policyRequest.HolderName,
                HolderEmail = policyRequest.HolderEmail,
                HolderPhone = policyRequest.HolderPhone,
                StartDate = policyRequest.StartDate.ToUniversalTime(),
                EndDate = policyRequest.EndDate.ToUniversalTime(),
                PremiumAmount = policyRequest.PremiumAmount,
                CoverageDetails = policyRequest.CoverageDetails,
            };
            
            dbContext.InsurancePolicies.Add(policy);
            await dbContext.SaveChangesAsync();

            return Results.Created($"/{policy.Id}", policy);
        });

        builder.MapPut("/{id:guid}", async (Guid id, InsurancePolicyRequest updatePolicyRequest, ClaimsPrincipal claimsPrincipal, ApplicationDbContext dbContext) =>
        {
            var userId = claimsPrincipal?.Claims?
                .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Results.Unauthorized();

            var policy = await dbContext.InsurancePolicies
                .FirstOrDefaultAsync(ip => ip.Id.Equals(id) && ip.CreatedById.Equals(userId));

            if (policy == null)
                return Results.NotFound(); 
            
            var policyWithNumber = dbContext.InsurancePolicies
                .FirstOrDefault(ip => ip.Id.Equals(updatePolicyRequest.PolicyNumber) && ip.CreatedById.Equals(userId) && !ip.Id.Equals(id));

            if (policyWithNumber != null) return Results.Conflict($"Policy number {updatePolicyRequest.PolicyNumber} already exists.");
            
            policy.PolicyNumber = updatePolicyRequest.PolicyNumber;
            policy.HolderName = updatePolicyRequest.HolderName;
            policy.HolderEmail = updatePolicyRequest.HolderEmail;
            policy.HolderPhone = updatePolicyRequest.HolderPhone;
            policy.StartDate = updatePolicyRequest.StartDate.ToUniversalTime();
            policy.EndDate = updatePolicyRequest.EndDate.ToUniversalTime();
            policy.PremiumAmount = updatePolicyRequest.PremiumAmount;
            policy.CoverageDetails = updatePolicyRequest.CoverageDetails;
                
            await dbContext.SaveChangesAsync();

            return Results.Ok(policy);
        });

        builder.MapDelete("/{id:guid}", async (Guid id, ClaimsPrincipal claimsPrincipal, ApplicationDbContext dbContext) =>
        {
            var userId = claimsPrincipal?.Claims?
                .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Results.Unauthorized();

            var policy = await dbContext.InsurancePolicies
                .FirstOrDefaultAsync(ip => ip.Id.Equals(id) && ip.CreatedById.Equals(userId));

            if (policy == null)
                return Results.NotFound();

            dbContext.InsurancePolicies.Remove(policy);
            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });

        return builder;
    }
}