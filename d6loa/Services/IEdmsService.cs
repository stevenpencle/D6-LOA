using d6loa.Models.Edms;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace d6loa.Services
{
    public interface IEdmsService
    {
        Task<string> AddNewDocumentAsync(string fileName, byte[] bytes, EdmsDocumentMetadata metadata);
        Task<string> AddNewVersionAsync(int documentId, string fileName, byte[] bytes);
        Task<byte[]> GetDocumentAsync(int documentId);
        Task<IEnumerable<EdmsDocumentType>> GetDocumentTypesAsync();
    }
}
