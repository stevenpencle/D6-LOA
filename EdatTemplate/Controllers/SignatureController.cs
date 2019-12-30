using EdatTemplate.Models.View;
using EdatTemplate.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;

namespace EdatTemplate.Controllers
{

    [Route("api/[controller]")]
    public class SignatureController : Controller
    {
        private readonly IBlobStorageProvider _blobStorageProvider;
        private readonly ISignatureService _signatureService;
        public SignatureController
        (
            IBlobStorageProvider blobStorageProvider,
            ISignatureService signatureService
        )
        {
            _blobStorageProvider = blobStorageProvider;
            _signatureService = signatureService;
        }

        [Authorize(Policy = "AdminOrB2C", AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        [HttpPost]
        [Route("[action]")]
        public async Task<DocumentMetadata> Save([FromBody] SignatureRequest request)
        {
            if (!string.IsNullOrWhiteSpace(request.CurrentSignatureId))
            {
                await _blobStorageProvider.DeleteBlobAsync(request.CurrentSignatureId);
            }
            if (request.PngDataUrl == null)
            {
                return null;
            }
            var image = _signatureService.ConvertPngDataUrlToImage(request.PngDataUrl);
            using (var ms = new MemoryStream(image))
            {
                var metadata = await _blobStorageProvider.UploadBlobAsync(ms, request.SignatureBlobStorageFolder, $"{User.Identity.Name} signature.png", User.Identity.Name);
                return metadata;
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<StringResponse> Load([FromBody] SignatureRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.CurrentSignatureId))
            {
                return new StringResponse
                {
                    Data = null
                };
            }
            using (var ms = await _blobStorageProvider.GetBlobAsync(request.CurrentSignatureId))
            {
                if (ms == null)
                {
                    return new StringResponse
                    {
                        Data = null
                    };
                }
                return new StringResponse
                {
                    Data = _signatureService.ConvertImageToPngDataUrl(ms.ToArray())
                };
            }
        }
    }
}