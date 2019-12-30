namespace EdatTemplate.Models.View
{
    public class SignatureRequest
    {
        public string CurrentSignatureId { get; set; }
        public string SignatureBlobStorageFolder { get; set; }
        public string PngDataUrl { get; set; }
    }
}