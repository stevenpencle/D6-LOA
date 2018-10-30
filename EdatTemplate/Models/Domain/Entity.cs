using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EdatTemplate.Models.Domain
{
    public class Entity : IValidatableObject
    {
        [Column(Order = 1001)]
        public DateTime LastUpdated { get; set; }

        [Column(Order = 1002)]
        [Range(0, int.MaxValue)]
        public int LastUpdatedByStaffId { get; set; }

        [Required]
        [Column(TypeName = "varchar(100)", Order = 1003)]
        [MaxLength(100, ErrorMessage = "Last Updated Name allows a maximum length of 100 characters.")]
        public string LastUpdatedBy { get; set; }

        public virtual IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            return new List<ValidationResult>();
        }
    }
}