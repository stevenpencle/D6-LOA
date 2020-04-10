using System;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace d6loa.Models.Domain
{
    public class Vendor : IValidatableObject, IAuditedEntity
    {
        public int VendorId { get; set; }
        public string VendorFeid { get; set; }  // Vendor Tax Identification Number
        public string VendorCompany { get; set; }
        public string VendorAddress1 { get; set; }
        public string VendorAddress2 { get; set; }
        public string VendorAddress3 { get; set; }
        public string VendorEmail { get; set; }
        public string VendorPerson { get; set; }
        public string VendorTelephone { get; set; }
        public DateTime LastUpdated { get; set; }
        public int LastUpdatedAppUserId { get; set; }
        public AppUser LastUpdatedAppUser { get; set; }
        public ICollection<Contract> Contracts { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            //add validations that cross over properties
            var validationResults = new List<ValidationResult>();
            string pattern = @"\A(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\Z";
            if (Regex.IsMatch(VendorEmail, pattern))
            {
                validationResults.Add(new ValidationResult(VendorEmail + " is not a valid email.", new[] { "VendorEmail" }));
            }
            return validationResults;
        }

    }
}
