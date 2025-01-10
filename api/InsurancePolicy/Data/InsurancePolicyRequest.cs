using System.ComponentModel.DataAnnotations;
using DataAnnotationsExtensions;

namespace InsurancePolicy.Data;

public record InsurancePolicyRequest(
    [Required] [StringLength(50)] string PolicyNumber,
    [Required] [StringLength(100)] string HolderName,
    [StringLength(100)] [EmailAddress] string? HolderEmail,
    [StringLength(100)] [Phone] string? HolderPhone,
    [Required] DateTime StartDate,
    [Required] DateTime EndDate,
    [Required] [property:Min(0)] decimal PremiumAmount,
    [StringLength(500)] string CoverageDetails
);
