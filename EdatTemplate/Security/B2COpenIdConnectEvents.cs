using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

namespace EdatTemplate.Security
{
    public class B2COpenIdConnectEvents : OpenIdConnectEvents
    {
        public B2COpenIdConnectEvents(OpenIdConnectB2COptions openIdConnectB2COptions)
        {
            OnTokenValidated = ctx =>
            {
                //Oddity-no identity or not authN > refuse role setup
                if (ctx.Principal.Identity == null || !ctx.Principal.Identity.IsAuthenticated)
                {
                    return Task.FromResult(0);
                }

                //Customize the Claims Identity with name and role claims.
                if (!ctx.Principal.HasClaim(p => p.Type.Equals("emails")))
                {
                    throw new SecurityTokenException("emails claim not found in token.");
                }

                //Verify the token is for the correct application policy
                if (!ctx.Principal.HasClaim(p => p.Type.Equals("tfp")))
                {
                    throw new SecurityTokenException("tfp claim not found in token.");
                }

                var policy = ctx.Principal.Claims.First(x => x.Type == "tfp").Value;
                if (policy != openIdConnectB2COptions.PolicySignInSignUp && 
                    policy != openIdConnectB2COptions.PolicyResetPassword && 
                    policy != openIdConnectB2COptions.PolicyEditProfile)
                {
                    throw new SecurityTokenException($"tfp claim value {ctx.Principal.Claims.First(x => x.Type == "tfp").Value} is not the correct policy.");
                }

                var name = ctx.Principal.Claims.First(x => x.Type == "emails").Value;
                var claimsIdentity = new ClaimsIdentity(ctx.Principal.Identity, null,
                    ctx.Principal.Identity.AuthenticationType, ApplicationClaims.NameClaim,
                    ApplicationClaims.RoleClaim);
                //Set auth type claim
                claimsIdentity.AddClaim(new Claim(ApplicationClaims.AuthenticationTypeClaim,
                    ApplicationAuthenticationType.B2C));
                //Set object (user) unique ID claim
                var sid = ctx.Principal.Claims
                    .First(x => x.Type == "http://schemas.microsoft.com/identity/claims/objectidentifier").Value;
                claimsIdentity.AddClaim(new Claim(ApplicationClaims.UserSid, sid));
                //Set name claim
                claimsIdentity.AddClaim(new Claim(ApplicationClaims.NameClaim, name));
                //Custom logic to examine ID claims for DB user profile evaluation to create application specific role claims.
                claimsIdentity.AddClaim(new Claim(ApplicationClaims.RoleClaim, ApplicationRoles.B2CUser));
                //TODO: Add database lookup on email or SID to add role claims 
                ctx.Principal = new ClaimsPrincipal(claimsIdentity);
                return Task.FromResult(0);
            };
            OnRedirectToIdentityProvider = ctx =>
            {
                var defaultPolicy = openIdConnectB2COptions.PolicySignInSignUp;
                if (ctx.Properties.Items.TryGetValue(openIdConnectB2COptions.PolicyKey, out var policy) &&
                    !policy.Equals(defaultPolicy))
                {
                    ctx.ProtocolMessage.Scope = OpenIdConnectScope.OpenIdProfile;
                    ctx.ProtocolMessage.ResponseType = OpenIdConnectResponseType.IdToken;
                    ctx.ProtocolMessage.IssuerAddress = ctx.ProtocolMessage.IssuerAddress.ToLower()
                        .Replace(defaultPolicy.ToLower(), policy.ToLower());
                    ctx.Properties.Items.Remove(openIdConnectB2COptions.PolicyKey);
                }

                return Task.FromResult(0);
            };
            OnRemoteFailure = ctx =>
            {
                ctx.HandleResponse();
                // Handle the error code that Azure AD B2C throws when trying to reset a password from the login page 
                // because password reset is not supported by a "sign-up or sign-in policy"
                if (ctx.Failure is OpenIdConnectProtocolException && ctx.Failure.Message.Contains("AADB2C90118"))
                {
                    // If the user clicked the reset password link, redirect to the reset password route
                    ctx.Response.Redirect("/security/B2CResetPassword");
                }
                else if (ctx.Failure is OpenIdConnectProtocolException && ctx.Failure.Message.Contains("access_denied"))
                {
                    ctx.Response.Redirect("/");
                }
                else
                {
                    throw ctx.Failure;
                }

                return Task.FromResult(0);
            };
        }
    }
}