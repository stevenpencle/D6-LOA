using System.Collections.Generic;

namespace d6loa.Security
{
    public class OpenIdConnectB2EOptions : OpenIdConnectOptions
    {
        public IDictionary<string, IEnumerable<string>> Roles { get; set; }
        public bool RemoveUnusedClaims { get; set; }
    }
}
