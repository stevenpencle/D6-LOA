using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace d6loa.Models.Domain
{
    public class Invoice : IValidatableObject, IAuditedEntity
    {

        public int Id { get; set; }
        public int ContractId { get; set; }
        public int LoaId { get; set; }
        public int InvoiceNumber { get; set; }
        public DateTime InvoiceDate { get; set; }
        public decimal InvoiceAmount { get; set; }
        public Boolean FinalInvoice { get; set; }
        public string Comment { get; set; }
        public DateTime LastUpdated { get; set; }
        public int LastUpdatedAppUserId { get; set; }
        public AppUser LastUpdatedAppUser { get; set; }
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            //add validations that cross over properties
            var validationResults = new List<ValidationResult>();

            return validationResults;
        }

    }
}
