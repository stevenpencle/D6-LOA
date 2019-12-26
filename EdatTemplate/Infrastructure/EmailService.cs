using EdatTemplate.Models.View;
using EdatTemplate.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Linq;
using System.Threading.Tasks;

namespace EdatTemplate.Infrastructure
{
    public class EmailService : IEmailService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly SendGridConfig _sendGridConfig;

        public EmailService(IWebHostEnvironment environment, IHttpContextAccessor httpContextAccessor, SendGridConfig sendGridConfig)
        {
            _environment = environment;
            _httpContextAccessor = httpContextAccessor;
            _sendGridConfig = sendGridConfig;
        }

        public async Task<bool> SendEmailAsync(EmailMessage emailMessage)
        {
            if (!_sendGridConfig.Enabled)
            {
                return true;
            }
            if (!emailMessage.Tos.Any())
            {
                return false;
            }
            var hasOverrideEmailAddresses = false;
            if (_sendGridConfig.OverrideToEmailAddresses != null)
            {
                var emailList = _sendGridConfig.OverrideToEmailAddresses.ToList();
                if (emailList.Count > 0)
                {
                    foreach (var email in emailList)
                    {
                        if (email.Trim() != "")
                        {
                            hasOverrideEmailAddresses = true;
                            break;
                        }
                    }
                }
            }
            if (_environment.IsDevelopment() || hasOverrideEmailAddresses)
            {
                emailMessage.Subject = $" ** {_environment.EnvironmentName} ** {emailMessage.Subject}";
                emailMessage.Body = $" <strong>**<p>In Production, this email would be sent to: {string.Join(",", emailMessage.Tos)}</p>**</strong><p>{emailMessage.Body}</p>";
                var hasEmailClaim = _httpContextAccessor.HttpContext != null && _httpContextAccessor.HttpContext.User.HasClaim(c => c.Type == _sendGridConfig.DeveloperEmailAddressClaim);
                if (hasOverrideEmailAddresses)
                {
                    emailMessage.Tos = _sendGridConfig.OverrideToEmailAddresses.Where(x => x.Trim() != "").ToList();
                }
                else if (hasEmailClaim)
                {
                    emailMessage.Tos = new[]
                    {
                        _httpContextAccessor.HttpContext.User.FindFirst(c => c.Type == _sendGridConfig.DeveloperEmailAddressClaim).Value
                    };
                }
                else
                {
                    return true;
                }
            }
            var sendGridClient = new SendGridClient(_sendGridConfig.ClientSecret);
            var sendGridMessage = new SendGridMessage
            {
                From = string.IsNullOrEmpty(emailMessage.From)
                    ? new EmailAddress(_sendGridConfig.DoNotReplyEmailAddress)
                    : new EmailAddress(emailMessage.From),
                Subject = emailMessage.Subject,
                HtmlContent = $"<div>{emailMessage.Body}</div>"
            };
            if (!emailMessage.Tos.Any())
            {
                return true;
            }
            sendGridMessage.AddTos(emailMessage.Tos.Select(email => new EmailAddress(email)).ToList());
            var response = await sendGridClient.SendEmailAsync(sendGridMessage);
            return response.StatusCode == System.Net.HttpStatusCode.Accepted;
        }
    }
}