using System;

namespace d6loa.Models.Edms
{
    public class EdmsDocumentVersion
    {
        public int Number { get; set; }
        public DateTime Date { get; set; }
        public string Label { get; set; }
        public string Comments { get; set; }
        public int ParentDocumentId { get; set; }
    }
}
