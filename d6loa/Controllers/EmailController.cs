using d6loa.Models.View;
using d6loa.Security;
using d6loa.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace d6loa.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = ApplicationRoles.Admin, AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
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
            return await _emailService.SendEmailAsync(emailMessage);
        }
    }
}
