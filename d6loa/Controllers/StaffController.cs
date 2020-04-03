using d6loa.Models.Arculus;
using d6loa.Models.Domain;
using d6loa.Models.View;
using d6loa.ORM;
using d6loa.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace d6loa.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Policy = "AdminOrB2C", AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
    public class StaffController : Controller
    {
        private readonly IStaffService _staffService;
        private readonly EntityContext _context;
        public StaffController
        (
            IStaffService staffService,
            EntityContext context
        )
        {
            _staffService = staffService;
            _context = context;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IEnumerable<Staff>> Search([FromBody] StringResponse namePattern)
        {
            return await _staffService.GetStaffByNameAsync(namePattern.Data);
        }

        [HttpGet]
        [Route("[action]/{id}")]
        public async Task<Staff> Get(int id)
        {
            return await _staffService.GetByIdAsync(id);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<FdotAppUser> SaveFdotAppUser([FromBody] Staff staff)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                var appUser = await _context.FdotAppUsers.Where(x => x.SrsId == staff.Id).SingleOrDefaultAsync();
                if (appUser == null)
                {
                    appUser = new FdotAppUser
                    {
                        Name = $"{staff.FirstName} {staff.LastName}",
                        Email = staff.EmailAddress,
                        SrsId = staff.Id,
                        District = staff.District,
                        RacfId = staff.RacfId
                    };
                    await _context.AddAsync(appUser);
                }
                else
                {
                    appUser.Name = $"{staff.FirstName} {staff.LastName}";
                    appUser.Email = staff.EmailAddress;
                    appUser.District = staff.District;
                    appUser.RacfId = staff.RacfId;
                }
                await _context.SaveChangesAsync();
                transaction.Commit();
                return appUser;
            }
        }
    }
}
