namespace d6loa.Security
{
    public class OpenIdConnectOptions
    {
        public string Authority { get; set; }
        public string CallbackPath { get; set; }
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public string Scheme { get; set; }
    }
}
