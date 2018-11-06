using System.Collections.Generic;

namespace EdatTemplate.Security
{
    public class OpenIdConnectB2EOptions : OpenIdConnectOptions
    {
        public IDictionary<string, IEnumerable<string>> Roles { get; set; }
    }
}