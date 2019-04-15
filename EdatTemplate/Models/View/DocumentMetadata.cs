using System;

namespace EdatTemplate.Models.View
{
    public class DocumentMetadata
    {
        public string Id { get; set; }
        public string FileName { get; set; }
        public string User { get; set; }
        public long FileSize { get; set; }
        public DateTime Uploaded { get; set; }
    }
}