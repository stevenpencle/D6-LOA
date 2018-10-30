using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using EdatTemplate.Models.View;

namespace EdatTemplate.Services
{
    public interface IBlobStorageProvider
    {
        Task<DocumentMetadata> UploadBlob(Stream stream, string directory, string fileName, string user);
        Task<IEnumerable<DocumentMetadata>> ListBlobs(string directory);
        Task<string> GetBlobDirectory(string name);
        Task<MemoryStream> GetBlob(string name);
        Task<bool> DeleteBlob(string name);
    }
}