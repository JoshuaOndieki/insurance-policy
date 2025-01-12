using System.ComponentModel.DataAnnotations;
using DataAnnotationsExtensions;
using Microsoft.EntityFrameworkCore;

namespace InsurancePolicy.Models;

public class InsurancePolicy: Auditable
{
    [Required]
    [StringLength(50)]
    public string PolicyNumber { get; set; }
        
    [Required]
    [StringLength(100)]
    public string HolderName { get; set; }
    
    [StringLength(100)]
    [EmailAddress]
    public string? HolderEmail { get; set; }
            
    [StringLength(100)]
    [Phone]
    public string? HolderPhone { get; set; }
        
    [Required]
    public DateTime StartDate { get; set; }
        
    [Required]
    public DateTime EndDate { get; set; }
        
    [Required]
    [Min(1)]
    public decimal PremiumAmount { get; set; } // TODO: support multiple currencies, currently implies KES
        
    [StringLength(500)]
    public string? CoverageDetails { get; set; }
}
