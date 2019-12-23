using EdatTemplate.Models.Edms;
using EdatTemplate.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EdatTemplate.Controllers
{
    [Authorize(Policy = "AdminOrB2C", AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    public class EdmsController : Controller
    {
        private readonly IEdmsService _edmsService;

        public EdmsController(IEdmsService edmsService)
        {
            _edmsService = edmsService;
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<EdmsDocumentType>> GetDocumentTypes()
        {
            return await _edmsService.GetDocumentTypes();
        }
    }
}