using EdatTemplate.Models.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EdatTemplate.Models.Domain
{
    [Table("EDATTB0001_Sample")]
    public class Sample : IValidatableObject, IAuditedEntity
    {
        [Key]
        [Column("SampleId")]
        public int Id { get; set; }

        [Required(ErrorMessage = "Sample Name is required.")]
        [MinLength(3, ErrorMessage = "Sample Name must have a minimum length of 3 characters.")]
        [MaxLength(50, ErrorMessage = "Sample Name allows a maximum length of 50 characters.")]

        [Column(TypeName = "varchar(50)")]
        public string Name { get; set; }

        public bool IsActive { get; set; }

        public StatusCode Status { get; set; }

        [Required(ErrorMessage = "Sample Birth Date is required.")]
        public DateTime? BirthDate { get; set; }

        [Required(ErrorMessage = "Sample Cost is required.")]
        public decimal Cost { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Assigned Staff is required.")]
        public int AssignedStaffId { get; set; }

        [Column(TypeName = "varchar(100)")]
        [MaxLength(100, ErrorMessage = "Assigned Staff Name allows a maximum length of 100 characters.")]
        public string AssignedStaffName { get; set; }

        public DateTime LastUpdated { get; set; }

        public int LastUpdatedByStaffId { get; set; }

        public string LastUpdatedBy { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            //add validations that cross over properties
            var validationResults = new List<ValidationResult>();
            if (Status == StatusCode.Approved && !IsActive)
            {
                validationResults.Add(new ValidationResult("Sample must be active to be approved.", new[] { nameof(Status), nameof(IsActive) }));
            }
            return validationResults;
        }
    }
}