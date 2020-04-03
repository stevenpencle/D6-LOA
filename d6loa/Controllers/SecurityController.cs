using d6loa.Models.Security;
using d6loa.Security;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace d6loa.Controllers
{
    public class SecurityController : Controller
    {
        private readonly AuthProviderConfig _authProviderConfig;
        private readonly OpenIdConnectB2EOptions _openIdConnectB2EOptions;
        private readonly OpenIdConnectB2COptions _openIdConnectB2COptions;

        public SecurityController
        (
            AuthProviderConfig authProviderConfig,
            OpenIdConnectB2EOptions openIdConnectB2EOptions,
            OpenIdConnectB2COptions openIdConnectB2COptions
        )
        {
            _authProviderConfig = authProviderConfig;
            _openIdConnectB2EOptions = openIdConnectB2EOptions;
            _openIdConnectB2COptions = openIdConnectB2COptions;
        }

        [HttpGet("api/[controller]/[action]")]
        public ClientToken GetToken()
        {
            if (!User.Identity.IsAuthenticated) return null;
            var claimsUser = (ClaimsIdentity)User.Identity;
            var token = new ClientToken
            {
                FullName = claimsUser.Name,
                UserId = claimsUser.HasClaim(x => x.Type == ApplicationClaims.UserId)
                    ? claimsUser.FindFirst(x => x.Type == ApplicationClaims.UserId).Value
                    : string.Empty,
                AuthMode = claimsUser.HasClaim(x => x.Type == ApplicationClaims.AuthenticationTypeClaim)
                    ? claimsUser.FindFirst(x => x.Type == ApplicationClaims.AuthenticationTypeClaim).Value
                    : string.Empty
            };
            if (claimsUser.HasClaim(x => x.Type == ApplicationClaims.RoleClaim))
            {
                token.Roles = claimsUser.FindAll(x => x.Type == ApplicationClaims.RoleClaim).Select(x => x.Value).ToArray();
            }
            else
            {
                token.Roles = new List<string>();
            }
            return token;
        }

        [HttpGet("api/[controller]/[action]")]
        public AuthProviderConfig GetAuthProviderConfig()
        {
            return _authProviderConfig;
        }

        [HttpGet("api/[controller]/[action]")]
        public IActionResult NotAuthorized()
        {
            return Forbid();
        }

        [HttpGet]
        public IActionResult AdLogin()
        {
            return Challenge(new AuthenticationProperties { RedirectUri = "/" }, _openIdConnectB2EOptions.Scheme);
        }

        [HttpGet]
        public IActionResult B2CLogin()
        {
            var properties = new AuthenticationProperties { RedirectUri = "/" };
            properties.Items[_openIdConnectB2COptions.PolicyKey] = _openIdConnectB2COptions.PolicySignInSignUp;
            return Challenge(properties, _openIdConnectB2COptions.Scheme);
        }

        [HttpGet]
        public IActionResult B2CResetPassword()
        {
            var properties = new AuthenticationProperties { RedirectUri = "/" };
            properties.Items[_openIdConnectB2COptions.PolicyKey] = _openIdConnectB2COptions.PolicyResetPassword;
            return Challenge(properties, _openIdConnectB2COptions.Scheme);
        }

        [HttpGet]
        [Authorize(Roles = ApplicationRoles.B2CUser, AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        public IActionResult B2CProfile()
        {
            var properties = new AuthenticationProperties { RedirectUri = "/" };
            properties.Items[_openIdConnectB2COptions.PolicyKey] = _openIdConnectB2COptions.PolicyEditProfile;
            return Challenge(properties, _openIdConnectB2COptions.Scheme);
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        public IActionResult Logout()
        {
            return User.Claims.First(c => c.Type == ApplicationClaims.AuthenticationTypeClaim).Value == ApplicationAuthenticationType.Ad
                ? SignOut(new AuthenticationProperties { RedirectUri = "/#/home?reload=true" }, CookieAuthenticationDefaults.AuthenticationScheme, _openIdConnectB2EOptions.Scheme)
                : SignOut(new AuthenticationProperties(), CookieAuthenticationDefaults.AuthenticationScheme, _openIdConnectB2COptions.Scheme);
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        public async Task<IActionResult> Impersonate(string id)
        {
            if (!_authProviderConfig.AllowImpersonation || !(User.Identity is ClaimsIdentity identity))
            {
                return Redirect("/#/home");
            }
            var claim = identity.Claims.FirstOrDefault(x => x.Type == ApplicationClaims.RoleClaim);
            if (claim != null)
            {
                identity.RemoveClaim(claim);
            }
            identity.AddClaim(new Claim(ApplicationClaims.RoleClaim, id));
            await HttpContext.SignInAsync(new ClaimsPrincipal(identity));
            return Redirect("/#/home?reload=true");
        }
    }
}
