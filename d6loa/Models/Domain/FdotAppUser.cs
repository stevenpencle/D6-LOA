using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace d6loa.Models.Domain
{
    public class FdotAppUser : AppUser
    {
        [Required(ErrorMessage = "SRS ID is required.")]
        public int SrsId { get; set; }

        [Required(ErrorMessage = "District is required.")]
        public string District { get; set; }

        [Required(ErrorMessage = "RACF ID is required.")]
        public string RacfId { get; set; }
        public virtual ICollection<Sample> SampleAssignments { get; set; }
    }
}
