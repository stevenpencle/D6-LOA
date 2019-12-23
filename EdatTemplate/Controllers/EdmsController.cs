using EdatTemplate.Models.Edms;
using EdatTemplate.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
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
        public async Task<IEnumerable<EdmsDocument>> UploadFiles()
        {
            var edmsDocuments = new List<EdmsDocument>();
            var files = HttpContext.Request.Form.Files;
            if (files.Count > 0)
            {
                foreach (var file in files)
                {
                    var documentMetaData = await ConfigureMetaData(file.FileName);
                    documentMetaData.FileSize = file.Length;
                    using (var stream = file.OpenReadStream())
                    {
                        using (var ms = new MemoryStream())
                        {
                            await stream.CopyToAsync(ms);
                            var response = await _edmsService.AddNewDocument(file.FileName, ms.ToArray(), documentMetaData);
                            edmsDocuments.Add(JsonConvert.DeserializeObject<EdmsDocument>(response));
                        }
                    }
                }
            }
            return edmsDocuments;
        }

        private async Task<EdmsDocumentMetadata> ConfigureMetaData(string fileName)
        {
            //EDMS Configuration : Meadata/properties this information will be specific to your application's use case
            var properties = new List<EdmsDocumentProperty> {
                new EdmsDocumentProperty {
                    Name = "FRST_NM",
                    MaxLength = 30,
                    Value = "John",
                    IsRequired = true
                },
                new EdmsDocumentProperty {
                    Name = "LAST_NM",
                    MaxLength = 30,
                    Value = "Doe",
                    IsRequired = true
                },
                new EdmsDocumentProperty {
                    Name = "ST_PERS_POS_ID",
                    Value = "010101",
                    IsRequired = true
                },
                new EdmsDocumentProperty {
                    Name = "AUTHOR_ID",
                    Value = "ITP_USER",
                    IsRequired = true
                }
            };
            var types = await _edmsService.GetDocumentTypes();
            var documentType = types.Any() ? types.Where(i => i.Id == "ODO012").FirstOrDefault() : null;
            var documentMetaData = new EdmsDocumentMetadata
            {
                Properties = properties,
                Name = fileName,
                DocumentType = documentType,
                Extension = "pdf",
                FormName = "ODOT_PROF",
            };
            return documentMetaData;
        }
    }
}