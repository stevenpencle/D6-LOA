using EdatTemplate.Models.View;
using EdatTemplate.Security;
using EdatTemplate.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EdatTemplate.Controllers
{
    [Authorize(Roles = ApplicationRoles.Admin)]
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
        [Authorize(Roles = ApplicationRoles.Admin)]
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
                    var metadata = await _blobStorageProvider.UploadBlob(files[i].OpenReadStream(), folder, file.FileName, User.Identity.Name);
                    metadatas.Add(metadata);
                    i++;
                }
            }
            return metadatas;
        }

        [HttpGet]
        [Route("[action]")]
        [Authorize(Roles = ApplicationRoles.Admin)]
        public async Task<IEnumerable<DocumentMetadata>> GetFileList(string directory)
        {
            return await _blobStorageProvider.ListBlobs(directory);
        }

        [HttpGet]
        [Route("[action]")]
        [Authorize(Roles = ApplicationRoles.Admin)]
        public async Task<IActionResult> GetFile(string id)
        {
            var blob = await _blobStorageProvider.GetBlob(id);
            if (blob == null)
            {
                return NotFound();
            }
            return File(blob, "application/octet-stream");
        }

        [HttpPost]
        [Route("[action]")]
        [Authorize(Roles = ApplicationRoles.Admin)]
        public async Task<StringResponse> RemoveFiles([FromBody] StringRequest request)
        {
            var l = await _blobStorageProvider.ListBlobs(request.Data);
            foreach (var documentMetadata in l)
            {
                await _blobStorageProvider.DeleteBlob(documentMetadata.Id);
            }
            return new StringResponse { Data = "files removed succesfully" };
        }

        [HttpPost]
        [Route("[action]")]
        [Authorize(Roles = ApplicationRoles.Admin)]
        public async Task<StringResponse> RemoveFile([FromBody] StringRequest request)
        {
            await _blobStorageProvider.DeleteBlob(request.Data);
            return new StringResponse { Data = "file removed succesfully" };
        }

    }
}