using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using EdatTemplate.Services;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;

namespace EdatTemplate.Security
{
    public class B2EOpenIdConnectEvents : OpenIdConnectEvents
    {
        public B2EOpenIdConnectEvents(OpenIdConnectB2EOptions openIdConnectB2EOptions, IStaffService staffService)
        {
            OnTokenValidated = async ctx =>
            {
                //Oddity-no identity or not authN > refuse role setup
                if (ctx.Principal.Identity == null || !ctx.Principal.Identity.IsAuthenticated)
                {
                    await Task.FromResult(0);
                    return;
                }
                //Customize the Claims Identity with name and role claims.
                var email = ctx.Principal.Identity.Name.ToLower();
                var name =
                    $"{ctx.Principal.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname").Value} {ctx.Principal.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname").Value}";
                var claimsIdentity = new ClaimsIdentity(ctx.Principal.Identity, null,
                    ctx.Principal.Identity.AuthenticationType, ApplicationClaims.NameClaim,
                    ApplicationClaims.RoleClaim);
                //Set auth type claim
                claimsIdentity.AddClaim(new Claim(ApplicationClaims.AuthenticationTypeClaim,
                    ApplicationAuthenticationType.Ad));
                //Set object (user) unique ID claim
                var sid = ctx.Principal.Claims.First(x =>
                    x.Type == "http://schemas.microsoft.com/identity/claims/objectidentifier").Value;
                claimsIdentity.AddClaim(new Claim(ApplicationClaims.UserSid, sid));
                //Set name claim
                claimsIdentity.AddClaim(new Claim(claimsIdentity.NameClaimType, name));
                //Get staff object
                var staff = await staffService.GetByEmail(email);
                if (staff == null)
                {
                    throw new InvalidOperationException($"Staff not found for email {email}");
                }
                claimsIdentity.AddClaim(new Claim(ApplicationClaims.UserId, staff.District.ToUpper() + "\\" + staff.RacfId.ToUpper()));
                claimsIdentity.AddClaim(new Claim(ApplicationClaims.StaffId, staff.Id.ToString()));
                //Custom logic to examine group claims and “transform” them into application specific claims. 
                var hasRole = false;
                foreach (var role in openIdConnectB2EOptions.Roles)
                {
                    foreach (var group in role.Value)
                    {
                        if (ctx.Principal.HasClaim(p => p.Type.Equals("groups") && p.Value.ToUpper().Trim() == group.ToUpper().Trim()))
                        {
                            claimsIdentity.AddClaim(new Claim(ApplicationClaims.RoleClaim, role.Key));
                            hasRole = true;
                            break;
                        }
                    }
                }
                if (!hasRole)
                {
                    claimsIdentity.AddClaim(new Claim(claimsIdentity.RoleClaimType,
                        ApplicationRoles.NotAuthorized));
                }
                ctx.Principal = new ClaimsPrincipal(claimsIdentity);
                await Task.FromResult(0);
            };
        }
    }
}