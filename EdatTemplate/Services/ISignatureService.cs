namespace EdatTemplate.Services
{
    public interface ISignatureService
    {
        byte[] ConvertPngDataUrlToImage(string pngDataUrl);
        string ConvertImageToPngDataUrl(byte[] image);
    }
}