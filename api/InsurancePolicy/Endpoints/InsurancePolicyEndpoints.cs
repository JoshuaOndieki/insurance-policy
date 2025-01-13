using System.Security.Claims;
using InsurancePolicy.Data;
using InsurancePolicy.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InsurancePolicy.Endpoints;

public static class InsurancePolicyEndpoints
{
    public static RouteGroupBuilder MapInsurancePolicyEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapGet("/", async (ClaimsPrincipal claimsPrincipal, ApplicationDbContext dbContext,
            [FromQuery] int page = 1, [FromQuery] int pageSize = 10,
            [FromQuery] string? sortField = "AddedDate", [FromQuery] string? sortOrder = "desc",
            [FromQuery] string? search = null) =>
        {
            var userId = claimsPrincipal?.Claims?
                .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Results.Unauthorized();

            var query = dbContext.InsurancePolicies
                .Where(ip => ip.CreatedById.Equals(userId));

            var totalCount = await query.CountAsync();
            
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(ip => ip.PolicyNumber.Contains(search) ||
                                          ip.HolderName.Contains(search) ||
                                          (ip.HolderEmail != null && ip.HolderEmail.Contains(search)) ||
                                          (ip.HolderPhone != null && ip.HolderPhone.Contains(search)) ||
                                          (ip.CoverageDetails != null && ip.CoverageDetails.Contains(search)));
            }

            if (!string.IsNullOrWhiteSpace(sortField))
            {
                query = sortField.ToLower() switch
                {
                    "premiumamount" => sortOrder.ToLower() == "desc"
                        ? query.OrderByDescending(ip => ip.PremiumAmount)
                        : query.OrderBy(ip => ip.PremiumAmount),
                    "startdate" => sortOrder.ToLower() == "desc"
                        ? query.OrderByDescending(ip => ip.StartDate)
                        : query.OrderBy(ip => ip.StartDate),
                    "addeddate" => sortOrder.ToLower() == "desc"
                        ? query.OrderByDescending(ip => ip.CreatedAtUtc)
                        : query.OrderBy(ip => ip.CreatedAtUtc),
                    _ => query.OrderByDescending(ip => ip.CreatedAtUtc) // Default sorting by CreatedAtUtc DESC
                };
            }

            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            var policies = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return Results.Ok(new
            {
                Metadata = new
                {
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = totalPages,
                    SortField = sortField,
                    SortOrder = sortOrder,
                    Search = search
                },
                Data = policies
            });
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

        builder.MapPost("/",
            async (InsurancePolicyRequest policyRequest, ClaimsPrincipal claimsPrincipal,
                ApplicationDbContext dbContext) =>
            {
                var userId = claimsPrincipal?.Claims?
                    .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                    return Results.Unauthorized();

                var policyWithNumber = dbContext.InsurancePolicies
                    .FirstOrDefault(ip =>
                        ip.PolicyNumber.Equals(policyRequest.PolicyNumber) && ip.CreatedById.Equals(userId));

                if (policyWithNumber != null)
                    return Results.Conflict($"Policy number {policyRequest.PolicyNumber} already exists.");

                var policy = new Models.InsurancePolicy()
                {
                    PolicyNumber = policyRequest.PolicyNumber,
                    HolderName = policyRequest.HolderName,
                    HolderEmail = policyRequest.HolderEmail,
                    HolderPhone = policyRequest.HolderPhone,
                    StartDate = policyRequest.StartDate.Value.UtcDateTime,
                    EndDate = policyRequest.EndDate.Value.UtcDateTime,
                    PremiumAmount = policyRequest.PremiumAmount,
                    CoverageDetails = policyRequest.CoverageDetails,
                };

                dbContext.InsurancePolicies.Add(policy);
                await dbContext.SaveChangesAsync();

                return Results.Created($"/{policy.Id}", policy);
            }).Validate<InsurancePolicyRequest>();

        builder.MapPut("/{id:guid}",
            async (Guid id, InsurancePolicyRequest updatePolicyRequest, ClaimsPrincipal claimsPrincipal,
                ApplicationDbContext dbContext) =>
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
                    .FirstOrDefault(ip =>
                        ip.Id.Equals(updatePolicyRequest.PolicyNumber) && ip.CreatedById.Equals(userId) &&
                        !ip.Id.Equals(id));

                if (policyWithNumber != null)
                    return Results.Conflict($"Policy number {updatePolicyRequest.PolicyNumber} already exists.");

                policy.PolicyNumber = updatePolicyRequest.PolicyNumber;
                policy.HolderName = updatePolicyRequest.HolderName;
                policy.HolderEmail = updatePolicyRequest.HolderEmail;
                policy.HolderPhone = updatePolicyRequest.HolderPhone;
                policy.StartDate = updatePolicyRequest.StartDate.Value.UtcDateTime;
                policy.EndDate = updatePolicyRequest.EndDate.Value.UtcDateTime;
                policy.PremiumAmount = updatePolicyRequest.PremiumAmount;
                policy.CoverageDetails = updatePolicyRequest.CoverageDetails;

                await dbContext.SaveChangesAsync();

                return Results.Ok(policy);
            }).Validate<InsurancePolicyRequest>();

        builder.MapDelete("/{id:guid}",
            async (Guid id, ClaimsPrincipal claimsPrincipal, ApplicationDbContext dbContext) =>
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