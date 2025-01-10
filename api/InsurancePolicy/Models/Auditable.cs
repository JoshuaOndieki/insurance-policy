using System.ComponentModel.DataAnnotations;

namespace InsurancePolicy.Models;

public abstract class Auditable
{
    [Key]
    public Guid Id { get; set; }

    public string CreatedById { get; set; }
    public User CreatedBy { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public string? LastModifiedById { get; set; }
    public User? LastModifiedBy { get; set; }
    public DateTime? LastModifiedAtUtc { get; set; }
    public DateTime? DeletedAtUtc { get; set; }
}