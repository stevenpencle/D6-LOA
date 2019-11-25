using System.Collections.Generic;

namespace EdatTemplate.Models.Edms
{
    public class EdmsDocument : EdmsDocumentMetadata
    {
        public int Id { get; set; }
        public IEnumerable<EdmsDocumentVersion> Versions { get; set; }
    }
}