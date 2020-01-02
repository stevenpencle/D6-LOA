using EdatTemplate.Models.Domain;
using EdatTemplate.ORM;
using EdatTemplate.Security;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EdatTemplate.Controllers
{
    [Authorize(Policy = "AdminOrB2C", AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    public class SampleMapController : Controller
    {
        private readonly EntityContext _context;
        public SampleMapController
        (
            EntityContext context
        )
        {
            _context = context;
        }

        [Authorize(Roles = ApplicationRoles.Admin, AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOrUpdate([FromBody] SampleMapFeature sampleMapFeature)
        {
            //clear model state
            ModelState.Clear();
            //validate entity level validations - entity data annotations and entity validate() method
            TryValidateModel(sampleMapFeature);
            //add or update the entity
            var tracker = sampleMapFeature.Id == 0 ? await _context.SampleMapFeatures.AddAsync(sampleMapFeature) : _context.SampleMapFeatures.Update(sampleMapFeature);
            await _context.SaveChangesAsync();
            //return the serialized entity
            return new ObjectResult(tracker.Entity);
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<SampleMapFeature>> Load()
        {
            var l = await _context.SampleMapFeatures.AsNoTracking().ToListAsync();
            return l;
        }
    }
}