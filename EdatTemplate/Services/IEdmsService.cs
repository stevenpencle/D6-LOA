using EdatTemplate.Models.Edms;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EdatTemplate.Services
{
    public interface IEdmsService
    {
        Task<string> AddNewDocument(string fileName, byte[] bytes, EdmsDocumentMetadata metadata);
        Task<string> AddNewVersion(int documentId, string fileName, byte[] bytes);
        Task<byte[]> GetDocument(int documentId);
        Task<IEnumerable<EdmsDocumentType>> GetDocumentTypes();
    }
}