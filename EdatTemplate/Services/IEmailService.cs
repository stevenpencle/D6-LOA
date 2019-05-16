using EdatTemplate.Models.View;
using System.Threading.Tasks;

namespace EdatTemplate.Services
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(EmailMessage emailMessage);
    }
}