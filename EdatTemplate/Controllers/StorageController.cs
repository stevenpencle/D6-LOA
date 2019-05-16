using EdatTemplate.Models.View;
using EdatTemplate.Security;
using EdatTemplate.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EdatTemplate.Controllers
{
    [Authorize(Roles = ApplicationRoles.Admin, AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    public class StorageController : Controller
    {
        private readonly IBlobStorageProvider _blobStorageProvider;

        public StorageController(IBlobStorageProvider blobStorageProvider)
        {
            _blobStorageProvider = blobStorageProvider;
        }

        [HttpPost]
        [Route("[action]")]
        [Authorize(Roles = ApplicationRoles.Admin, AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        public async Task<IEnumerable<DocumentMetadata>> UploadFiles()
        {
            var i = 0;
            var metadatas = new List<DocumentMetadata>();
            var files = HttpContext.Request.Form.Files;
            if (files.Count > 0)
            {
                foreach (var file in files)
                {
                    var folder = file.Name.Trim().ToUpper();
                    using (var stream = files[i].OpenReadStream())
                    {
                        var metadata = await _blobStorageProvider.UploadBlobAsync(stream, folder, file.FileName, User.Identity.Name);
                        metadatas.Add(metadata);
                        i++;
                    }
                }
            }
            return metadatas;
        }

        [HttpGet]
        [Route("[action]")]
        [Authorize(Roles = ApplicationRoles.Admin, AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        public async Task<IEnumerable<DocumentMetadata>> GetFileList(string directory)
        {
            return await _blobStorageProvider.ListBlobsAsync(directory);
        }

        [HttpGet]
        [Route("[action]")]
        [Authorize(Roles = ApplicationRoles.Admin, AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetFile(string id)
        {
            var blob = await _blobStorageProvider.GetBlobAsync(id);
            if (blob == null)
            {
                return NotFound();
            }
            return File(blob, "application/octet-stream");
        }

        [HttpPost]
        [Route("[action]")]
        [Authorize(Roles = ApplicationRoles.Admin, AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        public async Task<StringResponse> RemoveFiles([FromBody] StringRequest request)
        {
            var l = await _blobStorageProvider.ListBlobsAsync(request.Data);
            foreach (var documentMetadata in l)
            {
                await _blobStorageProvider.DeleteBlobAsync(documentMetadata.Id);
            }
            return new StringResponse { Data = "files removed succesfully" };
        }

        [HttpPost]
        [Route("[action]")]
        [Authorize(Roles = ApplicationRoles.Admin, AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        public async Task<StringResponse> RemoveFile([FromBody] StringRequest request)
        {
            await _blobStorageProvider.DeleteBlobAsync(request.Data);
            return new StringResponse { Data = "file removed succesfully" };
        }

    }
}