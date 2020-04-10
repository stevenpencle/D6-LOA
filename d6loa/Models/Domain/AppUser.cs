using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using d6loa.Models.Domain.Enums;

namespace d6loa.Models.Domain
{
    public abstract class AppUser
    {
        public int Id { get; set; }
        public AppUserType AppUserType { get; set; }

        [Required(ErrorMessage = "Application User Name is required.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Application User Email is required.")]
        public string Email { get; set; }
        public virtual ICollection<Sample> LastUpdatedSamples { get; set; }
        public virtual ICollection<Contract> LastUpdatedContracts { get; set; }
        public virtual ICollection<Vendor> LastUpdatedVendors { get; set; }

        public virtual ICollection<Supplement> LastUpdatedSupplements { get; set; }

        public virtual ICollection<Loa> LastUpdatedLoas { get; set; }

        public virtual ICollection<Invoice> LastUpdatedInvoices { get; set; }


    }
}
