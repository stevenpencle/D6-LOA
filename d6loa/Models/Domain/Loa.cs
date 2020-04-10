using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace d6loa.Models.Domain
{
    public class Loa : IValidatableObject, IAuditedEntity
    {
        public int Id { get; set; }
        public int ContractId { get; set; }
        public int LoaNumber { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime ExtDate { get; set; }  // Extension Date
        public decimal OriginalLoaAmt { get; set; }
        public decimal CurrentLoaAmt { get; set; }
        public decimal LoaBalance { get; set; }
        public decimal DecommitAmt { get; set; } // Decommitment Amount
        public string Comment { get; set; }
        public DateTime LastUpdated { get; set; }
        public int LastUpdatedAppUserId { get; set; }
        public AppUser LastUpdatedAppUser { get; set; }
        public Contract CurrentContracts { get; set; }
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            //add validations that cross over properties
            var validationResults = new List<ValidationResult>();

            return validationResults;
        }

    }
}
