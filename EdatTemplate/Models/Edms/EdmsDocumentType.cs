namespace EdatTemplate.Models.Edms
{
    public class EdmsDocumentType
    {
        public string Id { get; set; }
        public string Description { get; set; }
        public int SystemId { get; set; }
        public int ParentDocumentGroupId { get; set; }

    }
}