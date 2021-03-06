using d6loa.Models.View;
using d6loa.Services;
using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace d6loa.Infrastructure
{
    public class BlobStorageProvider : IBlobStorageProvider
    {
        private readonly CloudBlobContainer _container;

        public BlobStorageProvider(AzureStorageConfig azureStorageConfig)
        {
            var storageAccount = CloudStorageAccount.Parse(azureStorageConfig.ConnectionString);
            var blobClient = storageAccount.CreateCloudBlobClient();
            _container = blobClient.GetContainerReference(azureStorageConfig.ContainerName.ToLower());
            _container.CreateIfNotExistsAsync();
        }

        public async Task<DocumentMetadata> UploadBlobAsync(Stream stream, string directory, string fileName, string user)
        {
            var blobName = Guid.NewGuid().ToString();
            CloudBlockBlob blobReference;
            if (!string.IsNullOrEmpty(directory))
            {
                var dir = _container.GetDirectoryReference(directory.ToUpper().Trim());
                blobReference = dir.GetBlockBlobReference(blobName);
            }
            else
            {
                blobReference = _container.GetBlockBlobReference(blobName);
            }
            var length = stream.Length;
            var uploaded = DateTime.UtcNow;
            blobReference.Metadata.Add("filename", fileName);
            blobReference.Metadata.Add("user", user);
            blobReference.Metadata.Add("filesize", length.ToString());
            blobReference.Metadata.Add("uploaded", uploaded.ToString(CultureInfo.InvariantCulture));
            stream.Position = 0;
            await blobReference.UploadFromStreamAsync(stream);
            return new DocumentMetadata
            {
                FileName = fileName,
                FileSize = length,
                Id = blobReference.Name,
                Uploaded = uploaded,
                User = user
            };
        }

        public async Task<IEnumerable<DocumentMetadata>> ListBlobsAsync(string directory)
        {
            var list = new List<IListBlobItem>();
            BlobContinuationToken continuationToken = null;
            if (!string.IsNullOrEmpty(directory))
            {
                var dir = _container.GetDirectoryReference(directory.ToUpper().Trim());
                do
                {
                    var response = await dir.ListBlobsSegmentedAsync(false, BlobListingDetails.Metadata, null, continuationToken, new BlobRequestOptions(), new OperationContext());
                    continuationToken = response.ContinuationToken;
                    list.AddRange(response.Results);
                } while (continuationToken != null);
            }
            else
            {
                do
                {
                    var response = await _container.ListBlobsSegmentedAsync("", true, BlobListingDetails.Metadata, null, continuationToken, new BlobRequestOptions(), new OperationContext());
                    continuationToken = response.ContinuationToken;
                    list.AddRange(response.Results);
                } while (continuationToken != null);
            }
            return list.Select(x => new DocumentMetadata
            {
                Id = ((CloudBlockBlob)x).Name,
                FileName = ((CloudBlockBlob)x).Metadata["filename"],
                User = ((CloudBlockBlob)x).Metadata["user"],
                FileSize = long.Parse(((CloudBlockBlob)x).Metadata["filesize"]),
                Uploaded = DateTime.SpecifyKind(DateTime.Parse(((CloudBlockBlob)x).Metadata["uploaded"]), DateTimeKind.Utc)
            }).OrderByDescending(x => x.Uploaded);
        }

        public async Task<string> GetBlobDirectoryAsync(string name)
        {
            var blob = _container.GetBlockBlobReference(name);
            if (!await blob.ExistsAsync())
            {
                return null;
            }
            return blob.Parent.Prefix.TrimEnd('/');
        }

        public async Task<MemoryStream> GetBlobAsync(string name)
        {
            var ms = new MemoryStream();
            var blob = _container.GetBlockBlobReference(name);
            if (!await blob.ExistsAsync())
            {
                return null;
            }
            await blob.DownloadToStreamAsync(ms);
            ms.Position = 0;
            return ms;
        }

        public async Task<bool> DeleteBlobAsync(string name)
        {
            var blob = _container.GetBlockBlobReference(name);
            return await blob.DeleteIfExistsAsync();
        }
    }
}
