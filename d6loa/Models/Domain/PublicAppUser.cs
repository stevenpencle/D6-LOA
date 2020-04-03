using System.ComponentModel.DataAnnotations;

namespace d6loa.Models.Domain
{
    public class PublicAppUser : AppUser
    {
        [Required(ErrorMessage = "SID is required.")]
        public string Sid { get; set; }
    }
}
