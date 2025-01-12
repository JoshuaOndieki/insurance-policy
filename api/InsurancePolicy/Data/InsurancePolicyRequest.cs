using System.ComponentModel.DataAnnotations;
using DataAnnotationsExtensions;

namespace InsurancePolicy.Data;

public class InsurancePolicyRequest
{
    [Required]
    [StringLength(50, MinimumLength = 1, ErrorMessage = "Policy Number must be between 1 and 50 characters.")]
    public string PolicyNumber { get; set; }

    [Required]
    [StringLength(100, ErrorMessage = "Holder Name cannot exceed 100 characters.")]
    public string HolderName { get; set; }

    [StringLength(100)]
    [EmailAddress(ErrorMessage = "Invalid email address format.")]
    public string? HolderEmail { get; set; }

    [StringLength(100)]
    [Phone(ErrorMessage = "Invalid phone number format.")]
    public string? HolderPhone { get; set; }

    [Required]
    public DateTimeOffset? StartDate { get; set; }

    [Required]
    public DateTimeOffset? EndDate { get; set; }

    [Required]
    [Min(1, ErrorMessage = "Premium Amount must be greater than or equal to 1.")]
    public decimal PremiumAmount { get; set; }

    [StringLength(500)]
    public string? CoverageDetails { get; set; }
}
