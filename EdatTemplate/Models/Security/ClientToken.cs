using System.Collections.Generic;

namespace EdatTemplate.Models.Security
{
    public class ClientToken
    {
        public string FullName { get; set; }
        public string UserId { get; set; }
        public IEnumerable<string> Roles { get; set; }
        public string AuthMode { get; set; }
    }
}