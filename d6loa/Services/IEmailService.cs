using d6loa.Models.View;
using System.Threading.Tasks;

namespace d6loa.Services
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(EmailMessage emailMessage);
    }
}
