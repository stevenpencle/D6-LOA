namespace EdatTemplate.Security
{
    public class OpenIdConnectB2COptions : OpenIdConnectOptions
    {
        public string PolicyEditProfile { get; set; }
        public string PolicyResetPassword { get; set; }
        public string PolicySignInSignUp { get; set; }
        public string PolicyKey => "Policy";
    }
}