using EdatTemplate.Models.Domain;
using EdatTemplate.Models.View;
using EdatTemplate.ORM;
using EdatTemplate.Security;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EdatTemplate.Controllers
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
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

        [Authorize(Roles = ApplicationRoles.Admin, AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOrUpdateSample([FromBody] Sample sample)
        {
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

        [Authorize(Roles = ApplicationRoles.Admin, AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
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
        public GraphData GetPopulationChartData()
        {
            return new GraphData
            {
                Title = "Population by Country",
                SeriesData = new List<GraphSeries>
                {
                    new GraphSeries
                    {
                        Name = "Series 1",
                        Series = new List<GraphDataPoint>
                        {
                            new GraphDataPoint {Name = "Germany", Value = 8940000},
                            new GraphDataPoint {Name = "USA", Value = 5000000},
                            new GraphDataPoint {Name = "France", Value = 7200000}
                        }
                    }
                }
            };
        }

        [HttpGet]
        [Route("[action]")]
        public GraphData GetGdpChartData()
        {
            var date1 = new DateTime(2014, 9, 1);
            var date2 = new DateTime(2015, 9, 1);
            var date3 = new DateTime(2016, 9, 1);
            var date4 = new DateTime(2017, 9, 1);
            var date5 = new DateTime(2018, 9, 1);
            return new GraphData
            {
                Title = "GDP Per Capita",
                SeriesData = new List<GraphSeries>
                {
                    new GraphSeries
                    {
                        Name = "San Marino",
                        Series = new List<GraphDataPoint>
                        {
                            new GraphDataPoint {Name = date1.ToShortDateString(), Value = 2809},
                            new GraphDataPoint {Name = date2.ToShortDateString(), Value = 2325},
                            new GraphDataPoint {Name = date3.ToShortDateString(), Value = 3340},
                            new GraphDataPoint {Name = date4.ToShortDateString(), Value = 5319},
                            new GraphDataPoint {Name = date5.ToShortDateString(), Value = 6285}
                        }
                    },
                    new GraphSeries
                    {
                        Name = "British Indian Ocean Territory",
                        Series = new List<GraphDataPoint>
                        {
                            new GraphDataPoint {Name = date1.ToShortDateString(), Value = 6037},
                            new GraphDataPoint {Name = date2.ToShortDateString(), Value = 6823},
                            new GraphDataPoint {Name = date3.ToShortDateString(), Value = 4817},
                            new GraphDataPoint {Name = date4.ToShortDateString(), Value = 4262},
                            new GraphDataPoint {Name = date5.ToShortDateString(), Value = 5610}
                        }
                    },
                    new GraphSeries
                    {
                        Name = "Nicaragua",
                        Series = new List<GraphDataPoint>
                        {
                            new GraphDataPoint {Name = date1.ToShortDateString(), Value = 5426},
                            new GraphDataPoint {Name = date2.ToShortDateString(), Value = 2429},
                            new GraphDataPoint {Name = date3.ToShortDateString(), Value = 3037},
                            new GraphDataPoint {Name = date4.ToShortDateString(), Value = 5742},
                            new GraphDataPoint {Name = date5.ToShortDateString(), Value = 5577}
                        }
                    },
                    new GraphSeries
                    {
                        Name = "Kyrgyzstan",
                        Series = new List<GraphDataPoint>
                        {
                            new GraphDataPoint {Name = date1.ToShortDateString(), Value = 6271},
                            new GraphDataPoint {Name = date2.ToShortDateString(), Value = 5149},
                            new GraphDataPoint {Name = date3.ToShortDateString(), Value = 2237},
                            new GraphDataPoint {Name = date4.ToShortDateString(), Value = 2717},
                            new GraphDataPoint {Name = date5.ToShortDateString(), Value = 4085}
                        }
                    },
                    new GraphSeries
                    {
                        Name = "Bermuda",
                        Series = new List<GraphDataPoint>
                        {
                            new GraphDataPoint {Name = date1.ToShortDateString(), Value = 2507},
                            new GraphDataPoint {Name = date2.ToShortDateString(), Value = 6634},
                            new GraphDataPoint {Name = date3.ToShortDateString(), Value = 3324},
                            new GraphDataPoint {Name = date4.ToShortDateString(), Value = 2368},
                            new GraphDataPoint {Name = date5.ToShortDateString(), Value = 5932}
                        }
                    }
                }
            };
        }
    }
}