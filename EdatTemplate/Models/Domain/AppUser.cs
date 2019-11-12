using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using EdatTemplate.Models.Domain.Enums;

namespace EdatTemplate.Models.Domain
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

    }
}