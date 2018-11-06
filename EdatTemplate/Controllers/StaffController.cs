using EdatTemplate.Models.Domain;
using EdatTemplate.Models.View;
using EdatTemplate.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EdatTemplate.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class StaffController : Controller
    {
        private readonly IStaffService _staffService;
        public StaffController
        (
            IStaffService staffService
        )
        {
            _staffService = staffService;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IEnumerable<Staff>> Search([FromBody] StringResponse namePattern)
        {
            return await _staffService.GetStaffByName(namePattern.Data);
        }

        [HttpGet]
        [Route("[action]/{id}")]
        public async Task<Staff> Get(int id)
        {
            return await _staffService.GetById(id);
        }
    }
}