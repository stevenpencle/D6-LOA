using System.Collections.Generic;

namespace EdatTemplate.Models.Edms
{
    public class EdmsDocumentMetadata
    {
        public IEnumerable<EdmsDocumentProperty> Properties { get; set; }
        public string Name { get; set; }
        public EdmsDocumentType DocumentType { get; set; }
        public string Extension { get; set; }
        public long FileSize { get; set; }
        public string FormName { get; set; }
    }
}