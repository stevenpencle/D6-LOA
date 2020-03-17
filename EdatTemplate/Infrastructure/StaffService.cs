using EdatTemplate.Models.Arculus;
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
        private static readonly HttpClient Client = new HttpClient();
        private readonly string _endpoint;

        public StaffService(FdotCoreApisConfig fdotCoreApisConfig)
        {
            _endpoint = fdotCoreApisConfig.ProductUri + fdotCoreApisConfig.ApiStaff;
            Client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", fdotCoreApisConfig.ClientSecret);
        }

        public async Task<IEnumerable<Staff>> GetStaffByNameAsync(string name)
        {
            var uri = _endpoint;
            var nameParts = name.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
            if (nameParts.Length == 2)
            {
                uri += "?first-name=" + HttpUtility.UrlEncode(nameParts[0]) + "&last-name=" + HttpUtility.UrlEncode(nameParts[1]);

            }
            else
            {
                uri += "?partial-name=" + HttpUtility.UrlEncode(name);
            }
            var response = await Client.GetAsync(uri);
            var data = await response.Content.ReadAsStringAsync();
            var staffs = JsonConvert.DeserializeObject<IEnumerable<Staff>>(data);
            if (staffs != null)
            {
                foreach (var staff in staffs)
                {
                    staff.District = DecodeDistrict(staff.District);
                }
            }
            return staffs;
        }

        public async Task<Staff> GetByIdAsync(int id)
        {
            var uri = _endpoint + $"/{id}";
            var response = await Client.GetAsync(uri);
            var data = await response.Content.ReadAsStringAsync();
            var s = JsonConvert.DeserializeObject<Staff>(data);
            if (s != null)
            {
                s.District = DecodeDistrict(s.District);
            }
            return s;
        }

        public async Task<Staff> GetByEmailAsync(string email)
        {
            var uri = _endpoint + "?email-address=" + HttpUtility.UrlEncode(email);
            var response = await Client.GetAsync(uri);
            var data = await response.Content.ReadAsStringAsync();
            var sl = JsonConvert.DeserializeObject<IEnumerable<Staff>>(data).ToList();
            if (sl.Count != 1)
            {
                return null;
            }
            var s = sl.First();
            s.District = DecodeDistrict(s.District);
            return s;
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