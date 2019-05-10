using EdatTemplate.Models.Domain;
using EdatTemplate.Services;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace EdatTemplate.Infrastructure
{
    public class StaffService : IStaffService
    {
        private readonly static HttpClient _client = new HttpClient();
        private readonly FdotCoreApis _fdotCoreApis;
        private readonly string _endpoint;

        public StaffService(FdotCoreApis fdotCoreApis)
        {
            _fdotCoreApis = fdotCoreApis;
            _endpoint = _fdotCoreApis.ProductUri + _fdotCoreApis.ApiStaff;
            _client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", _fdotCoreApis.ClientSecret);
        }

        public async Task<IEnumerable<Staff>> GetStaffByName(string name)
        {
            var queryString = HttpUtility.ParseQueryString(string.Empty);
            var nameParts = name.Split(new[] {' '}, StringSplitOptions.RemoveEmptyEntries);
            if (nameParts.Length == 2)
            {
                queryString["firstName"] = nameParts[0];
                queryString["lastName"] = nameParts[1];
            }
            else
            {
                queryString["partialName"] = name;
            }
            queryString["status"] = "active";
            var uri = _endpoint + "SearchStaffBySearchCriteria?" + queryString;
            var response = await _client.GetAsync(uri);
            var data = await response.Content.ReadAsStringAsync();
            var staffs = JsonConvert.DeserializeObject<IEnumerable<Staff>>(data);
            return staffs
                .Select(s => new Staff
                {
                    FirstName = s.FirstName,
                    Id = s.Id,
                    LastName = s.LastName,
                    RacfId = s.RacfId,
                    EmailAddress = s.EmailAddress,
                    District = DecodeDistrict(s.District)
                }).ToList();
        }

        public async Task<Staff> GetById(int id)
        {
            var uri = _endpoint + $"GetStaffById?id={id}";
            var response = await _client.GetAsync(uri);
            var data = await response.Content.ReadAsStringAsync();
            var s = JsonConvert.DeserializeObject<Staff>(data);
            return new Staff
            {
                FirstName = s.FirstName,
                Id = s.Id,
                LastName = s.LastName,
                RacfId = s.RacfId,
                EmailAddress = s.EmailAddress,
                District = DecodeDistrict(s.District)
            };
        }

        public async Task<Staff> GetByEmail(string email)
        {
            var queryString = HttpUtility.ParseQueryString(string.Empty);
            queryString["emailAddress"] = email;
            queryString["status"] = "active";
            var uri = _endpoint + "SearchStaffBySearchCriteria?" + queryString;
            var response = await _client.GetAsync(uri);
            var data = await response.Content.ReadAsStringAsync();
            var sl = JsonConvert.DeserializeObject<IEnumerable<Staff>>(data).ToList();
            if (sl.Count != 1)
            {
                return null;
            }
            var s = sl.First();
            return new Staff
            {
                FirstName = s.FirstName,
                Id = s.Id,
                LastName = s.LastName,
                RacfId = s.RacfId,
                EmailAddress = s.EmailAddress,
                District = DecodeDistrict(s.District)
            };
        }

        private static string DecodeDistrict(string district)
        {
            if (district == null) return null;
            switch (district.Trim())
            {
                case "01": return "D1";
                case "02": return "D2";
                case "03": return "D3";
                case "04": return "D4";
                case "05": return "D5";
                case "06": return "D6";
                case "07": return "D7";
                case "08": return "TP";
                default: return "CO";
            }
        }
    }
}