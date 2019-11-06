using EdatTemplate.Models.View;
using EdatTemplate.Services;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

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
            var hasOverrideEmailAddresses = _sendGridConfig.OverrideToEmailAddresses != null && _sendGridConfig.OverrideToEmailAddresses.Any();
            if (_environment.IsDevelopment() || hasOverrideEmailAddresses)
            {
                emailMessage.Subject = $" ** {_environment.EnvironmentName} ** {emailMessage.Subject}";
                emailMessage.Body = $" <strong>**<p>In Production, this email would be sent to: {string.Join(",", emailMessage.Tos)}</p>**</strong><p>{emailMessage.Body}</p>";
                var hasEmailClaim = _httpContextAccessor.HttpContext != null && _httpContextAccessor.HttpContext.User.HasClaim(c => c.Type == _sendGridConfig.DeveloperEmailAddressClaim);
                if (hasOverrideEmailAddresses)
                {
                    emailMessage.Tos = _sendGridConfig.OverrideToEmailAddresses.ToList();
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
                HtmlContent = emailMessage.Body
            };
            sendGridMessage.AddTos(emailMessage.Tos.Select(email => new EmailAddress(email)).ToList());
            var response = await sendGridClient.SendEmailAsync(sendGridMessage);
            return response.StatusCode == System.Net.HttpStatusCode.Accepted;
        }
    }
}