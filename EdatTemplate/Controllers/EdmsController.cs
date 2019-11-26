using EdatTemplate.Models.Edms;
using EdatTemplate.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
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

        [HttpPost]
        [Route("[action]")]
        public async Task<EdmsDocument> UploadDocument(EdmsDocumentMetadata metadata)
        {
            var files = HttpContext.Request.Form.Files;
            if (files.Count == 1)
            {
                var file = files[0];
                using (var stream = file.OpenReadStream())
                {
                    var bytes = new byte[stream.Length];
                    await stream.ReadAsync(bytes, 0, (int)stream.Length);
                    metadata.FileSize = stream.Length;
                    var response = await _edmsService.AddNewDocument(file.FileName, bytes, metadata);
                    var document = JsonConvert.DeserializeObject<EdmsDocument>(response);
                    return document;
                }   
            }
            return null;
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetDocument(int id)
        {
            var blob = await _edmsService.GetDocument(id);
            if (blob == null)
            {
                return NotFound();
            }
            return File(blob, "application/octet-stream");
        }
    }
}