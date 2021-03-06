using d6loa.Models.View;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace d6loa.Services
{
    public interface IBlobStorageProvider
    {
        Task<DocumentMetadata> UploadBlobAsync(Stream stream, string directory, string fileName, string user);
        Task<IEnumerable<DocumentMetadata>> ListBlobsAsync(string directory);
        Task<string> GetBlobDirectoryAsync(string name);
        Task<MemoryStream> GetBlobAsync(string name);
        Task<bool> DeleteBlobAsync(string name);
    }
}
