using d6loa.Models.Edms;
using d6loa.Services;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace d6loa.Infrastructure
{
    public class EdmsService : IEdmsService
    {
        private static readonly HttpClient _client = new HttpClient();
        private readonly EdmsApiConfig _edmsApiConfig;
        private static IEnumerable<EdmsDocumentType> _documentTypes = null;
        private static readonly object Lock = new object();
        public EdmsService(EdmsApiConfig edmsApiConfig)
        {
            _edmsApiConfig = edmsApiConfig;
            _client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", _edmsApiConfig.ClientSecret);
        }

        private async Task<string> GetAuthenticationTokenFromApi()
        {
            var uri = $"{_edmsApiConfig.ProductUri}/authenticationToken";
            var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("Library", _edmsApiConfig.Library),
                new KeyValuePair<string, string>("UserId", _edmsApiConfig.UserId),
                new KeyValuePair<string, string>("Password", _edmsApiConfig.Password)
            });
            var response = await _client.PostAsync(uri, content);
            if (response.IsSuccessStatusCode)
            {
                var stringResponse = await response.Content.ReadAsStringAsync();
                return stringResponse.Replace("\"", "");
            }
            var errorXml = await response.Content.ReadAsStringAsync();
            throw new Exception(errorXml);
        }

        public async Task<IEnumerable<EdmsDocumentType>> GetDocumentTypesAsync()
        {
            // this method caches the document types from the EDMS service
            if (_documentTypes != null)
            {
                return _documentTypes;
            }
            var token = await GetAuthenticationTokenFromApi();
            var url = $"{_edmsApiConfig.ProductUri}/documentTypes?authenticationToken={token}";
            var response = await _client.GetAsync(url);
            var data = await response.Content.ReadAsStringAsync();
            lock (Lock)
            {
                if (_documentTypes != null)
                {
                    return _documentTypes;
                }
                var sl = JsonConvert.DeserializeObject<IEnumerable<EdmsDocumentType>>(data).ToList();
                if (sl.Any())
                {
                    _documentTypes = sl.OrderBy(x => x.Id);
                }
            }
            return _documentTypes;
        }

        public async Task<string> AddNewDocumentAsync(string fileName, byte[] bytes, EdmsDocumentMetadata metadata)
        {
            var token = await GetAuthenticationTokenFromApi();
            var url = $"{_edmsApiConfig.ProductUri}/addNewDocument?authenticationToken={token}";
            metadata.FileSize = bytes.Length;
            var serializedMetadata = JsonConvert.SerializeObject(metadata, Formatting.None);
            var form = new MultipartFormDataContent
            {
                {
                    new StringContent(serializedMetadata), "metadata"
                },
                {
                    new ByteArrayContent(bytes, 0, bytes.Length), "file", "fileName"
                }
            };
            var response = await _client.PostAsync(url, form);
            if (response.StatusCode != HttpStatusCode.OK)
            {
                throw new Exception(response.Content.ReadAsStringAsync().Result);
            }
            var data = await response.Content.ReadAsStringAsync();
            return data;
        }

        public async Task<string> AddNewVersionAsync(int documentId, string fileName, byte[] bytes)
        {
            var token = await GetAuthenticationTokenFromApi();
            var url = $"{_edmsApiConfig.ProductUri}/document/{documentId}/addVersion?authenticationToken={token}";
            var form = new MultipartFormDataContent
            {
                {
                    new ByteArrayContent(bytes, 0, bytes.Length), "file", "fileName"
                }
            };
            var response = await _client.PostAsync(url, form);
            if (response.StatusCode != HttpStatusCode.OK)
            {
                throw new Exception(response.Content.ReadAsStringAsync().Result);
            }
            var data = await response.Content.ReadAsStringAsync();
            return data;
        }

        public async Task<byte[]> GetDocumentAsync(int documentId)
        {
            var token = await GetAuthenticationTokenFromApi();
            var url = $"{_edmsApiConfig.ProductUri}/document/{documentId}?authenticationToken={token}";
            var response = await _client.GetAsync(new Uri(url));
            if (response.StatusCode != HttpStatusCode.OK)
            {
                throw new Exception(response.Content.ReadAsStringAsync().Result);
            }
            var data = await response.Content.ReadAsByteArrayAsync();
            return data;
        }
    }
}
