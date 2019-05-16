using EdatTemplate.Infrastructure;
using EdatTemplate.Services;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace EdatTemplate.Security
{
    public class B2EOpenIdConnectEvents : OpenIdConnectEvents
    {
        public B2EOpenIdConnectEvents(OpenIdConnectB2EOptions openIdConnectB2EOptions, IStaffService staffService, SendGridConfig sendGridConfig)
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
                var identityClaims = new List<Claim>
                {
                    //Set auth type claim
                    new Claim(ApplicationClaims.AuthenticationTypeClaim, ApplicationAuthenticationType.Ad)
                };
                //Set object (user) unique ID claim
                var sid = ctx.Principal.Claims.First(x =>
                    x.Type == "http://schemas.microsoft.com/identity/claims/objectidentifier").Value;
                identityClaims.Add(new Claim(ApplicationClaims.UserSid, sid));
                //Set name claim
                identityClaims.Add(new Claim(claimsIdentity.NameClaimType, name));
                //Get staff object
                var staff = await staffService.GetByEmailAsync(email);
                if (staff == null)
                {
                    var givenName = ctx.Principal.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname").Value;
                    var surName = ctx.Principal.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname").Value;
                    staff = await staffService.GetByEmailAsync($"{givenName}.{surName}@dot.state.fl.us");
                    if (staff == null)
                    {
                        throw new InvalidOperationException($"Staff not found for email {email}");
                    }
                }
                identityClaims.Add(new Claim(ApplicationClaims.UserId, staff.District.ToUpper() + "\\" + staff.RacfId.ToUpper()));
                identityClaims.Add(new Claim(ApplicationClaims.StaffId, staff.Id.ToString()));
                //Custom logic to examine group claims and “transform” them into application specific claims.
                //Roles should be placed in appsettings in the hierarchical order of most important to least important because the standard behavior is
                //to break the loop on the first successful match 
                var hasRole = false;
                foreach (var role in openIdConnectB2EOptions.Roles)
                {
                    //TODO: remove this is you support a single user having multiple roles
                    if (hasRole)
                    {
                        //first role matched, so break out
                        break;
                    }
                    //END
                    foreach (var group in role.Value)
                    {
                        if (ctx.Principal.HasClaim(p => p.Type.Equals("groups") && p.Value.ToUpper().Trim() == group.ToUpper().Trim()))
                        {
                            identityClaims.Add(new Claim(ApplicationClaims.RoleClaim, role.Key));
                            hasRole = true;
                            break;
                        }
                    }
                }
                if (!hasRole)
                {
                    identityClaims.Add(new Claim(claimsIdentity.RoleClaimType, ApplicationRoles.NotAuthorized));
                }
                if (openIdConnectB2EOptions.RemoveUnusedClaims)
                {
                    var currentClaims = claimsIdentity.Claims.ToArray();
                    foreach (var claim in currentClaims)
                    {
                        if (claim.Type == sendGridConfig.DeveloperEmailAddressClaim) continue;
                        claimsIdentity.RemoveClaim(claim);
                    }
                }
                foreach (var claim in identityClaims)
                {
                    claimsIdentity.AddClaim(claim);
                }
                ctx.Principal = new ClaimsPrincipal(claimsIdentity);
                await Task.FromResult(0);
            };
            OnRemoteFailure = ctx =>
            {
                ctx.HandleResponse();
                if (ctx.Failure is OpenIdConnectProtocolException && ctx.Failure.Message.Contains("access_denied"))
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