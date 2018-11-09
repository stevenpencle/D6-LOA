using System.Threading.Tasks;
using EdatTemplate.Models.View;
using EdatTemplate.Security;
using EdatTemplate.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EdatTemplate.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = ApplicationRoles.Admin)]
    public class EmailController : Controller
    {
        private readonly IEmailService _emailService;
        public EmailController
        (
            IEmailService emailService
        )
        {
            _emailService = emailService;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<bool> Send([FromBody] EmailMessage emailMessage)
        {
            return await _emailService.SendEmail(emailMessage);
        }
    }
}