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
                            var response = await _edmsService.AddNewDocumentAsync(file.FileName, ms.ToArray(), documentMetaData);
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
            var documentTypeId = "AV001";
            var types = await _edmsService.GetDocumentTypesAsync();
            var documentType = types.Any() ? types.First(x => x.Id == documentTypeId) : null;
            if (documentType == null)
            {
                throw new ApplicationException($"Invalid Document Type: {documentTypeId}");
            }
            var properties = new List<EdmsDocumentProperty> {
                new EdmsDocumentProperty {
                    Name = "FINPROJ",
                    Value = "11111111111",
                    IsRequired = true
                },
                // new EdmsDocumentProperty {
                //     Name = "DOCUMGRP",
                //     Value = "AV01",
                //     IsRequired = true
                // },
                // new EdmsDocumentProperty {
                //     Name = "DOCUMTYPE_ID",
                //     Value = documentType.Id,
                //     IsRequired = true
                // },
                new EdmsDocumentProperty {
                    Name = "AUTHOR_ID",
                    Value = "TESTID",
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