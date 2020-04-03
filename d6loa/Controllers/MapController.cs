using d6loa.Models.View;
using d6loa.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace d6loa.Controllers
{

    [Authorize(Policy = "AdminOrB2C", AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    public class MapController : Controller
    {
        private readonly IBlobStorageProvider _blobStorageProvider;
        public MapController
        (
            IBlobStorageProvider blobStorageProvider
        )
        {
            _blobStorageProvider = blobStorageProvider;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<DocumentMetadata> Save([FromBody] MapRequest request)
        {
            if (!string.IsNullOrWhiteSpace(request.CurrentMapId))
            {
                await _blobStorageProvider.DeleteBlobAsync(request.CurrentMapId);
            }
            using (var ms = new MemoryStream(Encoding.ASCII.GetBytes(request.MapGeoJson)))
            {
                var metadata = await _blobStorageProvider.UploadBlobAsync(ms, request.MapBlobStorageFolder, $"{User.Identity.Name} map.geojson", User.Identity.Name);
                return metadata;
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<StringResponse> Load([FromBody] MapRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.CurrentMapId))
            {
                return new StringResponse
                {
                    Data = null
                };
            }
            using (var ms = await _blobStorageProvider.GetBlobAsync(request.CurrentMapId))
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
                    Data = Encoding.ASCII.GetString(ms.ToArray())
                };
            }
        }
    }
}
