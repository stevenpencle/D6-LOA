using System.ComponentModel.DataAnnotations;

namespace EdatTemplate.Models.Domain
{
    public class PublicAppUser : AppUser
    {
        [Required(ErrorMessage = "SID is required.")]
        public string Sid { get; set; }
    }
}