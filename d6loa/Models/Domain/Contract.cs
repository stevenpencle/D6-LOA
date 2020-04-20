using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace d6loa.Models.Domain
{
    public class Contract : IValidatableObject, IAuditedEntity
    {

        public int Id { get; set; }

        [Required(ErrorMessage = "Contract # is required.")]
        [MinLength(6, ErrorMessage = "Contract # must be 6 - 10 characters.")]
        [MaxLength(10, ErrorMessage = "Contract # must be 6 - 10 characters.")]
        public string ContractNumber { get; set; }
        [Required(ErrorMessage = "FM # is required.")]
        [MaxLength(16, ErrorMessage = "FM # must be 16 characters or less.")]
        public string FmNumber { get; set; }
        [Required(ErrorMessage = "Start Date is required.")]
        public DateTime StartDate { get; set; }
        [Required(ErrorMessage = "End Date is required.")]
        public DateTime EndDate { get; set; }
       // [Required(ErrorMessage = "Extension Date is required.")]
        public DateTime ExtDate { get; set; }
        public Decimal OriginalContractAmt { get; set; }
        public Decimal CurrentContractAmt { get; set; }
        public Decimal ContractBalance { get; set; }
        public Decimal DecommitBalance { get; set; }

        [MaxLength(2048)]
        public String Comment { get; set; }
        public DateTime LastUpdated { get; set; }
        public int LastUpdatedAppUserId { get; set; }
        public AppUser LastUpdatedAppUser { get; set; }
        public int VendorId { get; set; }
        public Vendor CurrentVendor { get; set; }
        public ICollection<Loa> Loas { get; set; }
        public ICollection<Supplement> Supplements { get; set; }



        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            //add validations that cross over properties
            var validationResults = new List<ValidationResult>();
            if (StartDate >= DateTime.Now)
            {
                validationResults.Add(new ValidationResult("Start Date cannot be a future date", new[] { "StartDate" }));
            }
            
            
            if (EndDate < StartDate)
                {
                    validationResults.Add(new ValidationResult("Start Date less than End Date", new[] { "EndDate" }));
                   
                }
                
           

            return validationResults;

 
            
        }

    }
}
