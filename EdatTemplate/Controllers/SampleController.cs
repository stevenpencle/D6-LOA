using EdatTemplate.Models.Domain;
using EdatTemplate.Models.View;
using EdatTemplate.ORM;
using EdatTemplate.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace EdatTemplate.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class SampleController : Controller
    {
        private readonly EntityContext _context;
        public SampleController
        (
            EntityContext context
        )
        {
            _context = context;
        }

        [Authorize(Roles = ApplicationRoles.Admin)]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOrUpdateSample([FromBody] Sample sample)
        {
            //set server-side entity data
            sample.LastUpdated = DateTime.Now;
            sample.LastUpdatedBy = User.Identity.Name;
            var staffClaim = ((ClaimsIdentity)User.Identity).FindFirst(ApplicationClaims.StaffId);
            sample.LastUpdatedByStaffId = staffClaim == null ? 0 : int.Parse(staffClaim.Value);
            //clear model state
            ModelState.Clear();
            //validate entity level validations - entity data annotations and entity validate() method
            TryValidateModel(sample);
            if (ModelState.IsValid)
            {
                //if the entity passed its own validations, validate any cross-entity business rules
                var sameNamedEntity = await _context.Samples
                    .Where(x => x.Id != sample.Id)
                    .Where(x => x.Name.Trim().ToUpper() == sample.Name.Trim().ToUpper())
                    .AsNoTracking()
                    .FirstOrDefaultAsync();
                if (sameNamedEntity != null)
                {
                    //entity with the same name already exists, so return an error
                    ModelState.AddModelError(nameof(sample.Name), "Sample Name must be unique.");
                    return BadRequest(ModelState);
                }
            }
            else
            {
                //entity failed its own validations, so return the errors
                return BadRequest(ModelState);
            }
            //add or update the entity
            var tracker = sample.Id == 0 ? await _context.Samples.AddAsync(sample) : _context.Samples.Update(sample);
            await _context.SaveChangesAsync();
            //return the serialized entity
            return new ObjectResult(tracker.Entity);
        }

        [Authorize(Roles = ApplicationRoles.Admin)]
        [HttpPost]
        [Route("[action]")]
        public async Task<StringResponse> RemoveSample([FromBody] Sample sample)
        {
            var ent = await _context.Samples
                .Where(i => i.Id == sample.Id)
                .SingleOrDefaultAsync();
            if (ent == null) return new StringResponse { Data = "Sample Not Found" };
            _context.Samples.Remove(ent);
            await _context.SaveChangesAsync();
            return new StringResponse { Data = "Sample Removed" };
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<Sample>> GetSamples()
        {
            var l = await _context.Samples
                .AsNoTracking()
                .ToListAsync();
            return l;
        }

        [HttpGet]
        [Route("[action]")]
        public IEnumerable<NameValuePair> GetChartData()
        {
            return new List<NameValuePair>
            {
                new NameValuePair {Name = "Germany", Value = 8940000},
                new NameValuePair {Name = "USA", Value = 5000000},
                new NameValuePair {Name = "France", Value = 7200000}
            };
        }
    }
}