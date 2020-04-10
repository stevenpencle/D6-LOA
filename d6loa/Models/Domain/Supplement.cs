using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace d6loa.Models.Domain
{
    public class Supplement : IValidatableObject, IAuditedEntity
    {

        public int Id { get; set; }
        public int ContractId { get; set; }
        public int SupplementNumber { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal SupplementAmount { get; set; }
        public DateTime LastUpdated { get; set; }
        public int LastUpdatedAppUserId { get; set; }
        public AppUser LastUpdatedAppUser { get; set; }
        public Contract CurrentContract { get; set; }
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            //add validations that cross over properties
            var validationResults = new List<ValidationResult>();

            return validationResults;
        }

    }
}
