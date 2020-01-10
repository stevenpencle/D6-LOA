using EdatTemplate.Models.Edms;
using EdatTemplate.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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
        public async Task<EdmsDocument> AddDocument()
        {
            var edmsDocument = new EdmsDocument();
            var files = HttpContext.Request.Form.Files;
            if (files.Count == 1)
            {
                var file = files[0];
                var types = await _edmsService.GetDocumentTypesAsync();
                var documentType = types.Any() ? types.First(x => x.Id == file.Name) : null;
                if (documentType == null)
                {
                    throw new ApplicationException($"Invalid Document Type: {file.Name}");
                }
                var documentMetaData = ConfigureMetaData(documentType, file.FileName);
                documentMetaData.FileSize = file.Length;
                using (var stream = file.OpenReadStream())
                {
                    using (var ms = new MemoryStream())
                    {
                        await stream.CopyToAsync(ms);
                        var response = await _edmsService.AddNewDocumentAsync(file.FileName, ms.ToArray(), documentMetaData);
                        edmsDocument = JsonConvert.DeserializeObject<EdmsDocument>(response);
                    }
                }
            }
            return edmsDocument;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<EdmsDocument> AddDocumentVersion()
        {
            var edmsDocument = new EdmsDocument();
            var files = HttpContext.Request.Form.Files;
            if (files.Count == 1)
            {
                var file = files[0];
                using (var stream = file.OpenReadStream())
                {
                    using (var ms = new MemoryStream())
                    {
                        await stream.CopyToAsync(ms);
                        var documentId = int.Parse(file.Name);
                        var response = await _edmsService.AddNewVersionAsync(documentId, file.FileName, ms.ToArray());
                        edmsDocument = JsonConvert.DeserializeObject<EdmsDocument>(response);
                    }
                }
            }
            return edmsDocument;
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetDocument(int id)
        {
            var blob = await _edmsService.GetDocumentAsync(id);
            if (blob == null)
            {
                return NotFound();
            }
            return File(blob, "application/octet-stream");
        }

        private EdmsDocumentMetadata ConfigureMetaData(EdmsDocumentType documentType, string fileName)
        {
            // EDMS Configuration : Metadata/properties this information will be specific to your application's use case
            // In this example, we're using the aviation document group and type (e.g. AV001) passed from the angular component
            // for aviation, the financial project number is required metadata
            var properties = new List<EdmsDocumentProperty>
            {
                new EdmsDocumentProperty {
                    Name = "FINPROJ",
                    Value = "11111111111",
                    IsRequired = true
                }
            };
            var documentMetaData = new EdmsDocumentMetadata
            {
                Properties = properties,
                Name = fileName,
                DocumentType = documentType,
                Extension = "pdf",
                FormName = "ENTRPRSE_PROFILE",
            };
            return documentMetaData;
        }
    }
}