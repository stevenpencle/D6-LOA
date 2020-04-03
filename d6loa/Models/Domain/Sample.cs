using d6loa.Models.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace d6loa.Models.Domain
{
    public class Sample : IValidatableObject, IAuditedEntity
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Sample Name is required.")]
        [MinLength(3, ErrorMessage = "Sample Name must have a minimum length of 3 characters.")]
        [MaxLength(50, ErrorMessage = "Sample Name allows a maximum length of 50 characters.")]
        public string Name { get; set; }

        public bool IsActive { get; set; }

        public StatusCode Status { get; set; }

        [Required(ErrorMessage = "Sample Birth Date is required.")]
        public DateTime? BirthDate { get; set; }

        [Required(ErrorMessage = "Sample Cost is required.")]
        public decimal Cost { get; set; }

        [Required(ErrorMessage = "FDOT User Assignment is required.")]
        public int? AssignedFdotAppUserId { get; set; }
        public FdotAppUser AssignedFdotAppUser { get; set; }
        public DateTime LastUpdated { get; set; }
        public int LastUpdatedAppUserId { get; set; }
        public AppUser LastUpdatedAppUser { get; set; }
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
