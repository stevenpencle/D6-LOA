using System;

namespace d6loa.Services
{
    public class SignatureService : ISignatureService
    {
        public string ConvertImageToPngDataUrl(byte[] image)
        {
            var base64String = Convert.ToBase64String(image);
            return $"data:image/png;base64,{base64String}";
        }

        public byte[] ConvertPngDataUrlToImage(string pngDataUrl)
        {
            if (string.IsNullOrWhiteSpace(pngDataUrl) ||
                !pngDataUrl.Trim().ToLower().StartsWith("data:image/png;base64,"))
            {
                throw new ArgumentException("Format is invalid.", "pngDataUrl");
            }
            var encodedImageArray = pngDataUrl.Trim().Split(",");
            if (encodedImageArray.Length != 2)
            {
                throw new ArgumentException("Format is invalid.", "pngDataUrl");
            }
            return Convert.FromBase64String(encodedImageArray[1].Trim());
        }
    }
}
