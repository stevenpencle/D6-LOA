using d6loa.Models.Domain;
using d6loa.Models.View;
using d6loa.ORM;
using d6loa.Security;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace d6loa.Controllers
{
    [Authorize(Policy = "AdminOrB2C", AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    public class ContractController : Controller
    {
            private readonly EntityContext _context;

            public ContractController(EntityContext context)
            {
                _context = context;

            }

        [Authorize(Policy = "AdminOrB2C", AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        [HttpPost]
        [Route("[action]")]


            public async Task<IActionResult> Save([FromBody] Contract contract)
            {

            //clear model state
            ModelState.Clear();
            //validate entity level validations - entity data annotations and entity validate() method
            TryValidateModel(contract);
             if (ModelState.IsValid)
            {
                using(var transaction = _context.Database.BeginTransaction())
                {
                    await _context.Contracts.AddAsync(contract);
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                }
                return new ObjectResult(contract);

            }
            else
            {
                //entity failed its own validations, so return the errors
                return BadRequest(ModelState);
            }


            }

    }
}