using EdatTemplate.Models.View;
using EdatTemplate.Services;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;

namespace EdatTemplate.Automation
{
    public class SampleHostedService : HostedService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IEmailService _emailService;

        public SampleHostedService
        (
            IServiceProvider serviceProvider,
            IEmailService emailService
        )
        {
            _serviceProvider = serviceProvider;
            _emailService = emailService;
        }

        protected override async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            var serviceLoopCount = 0;
            while (!cancellationToken.IsCancellationRequested)
            {
                using (var serviceScope = _serviceProvider.GetRequiredService<IServiceScopeFactory>().CreateScope())
                {
                //     using (var entityContext = serviceScope.ServiceProvider.GetService<EntityContext>())
                //     {
                //         using (var transaction = entityContext.Database.BeginTransaction())
                //         {
                //             //do something   
                //             //await SendEmail(); 
                //         }
                //     }
                }
                serviceLoopCount += 1;
                Debug.Write($"SampleHosetedService task executed {serviceLoopCount} times!{Environment.NewLine}");
                //repeat the task every 10 seconds
                await Task.Delay(TimeSpan.FromSeconds(10), cancellationToken);
            }
        }

        private async Task SendEmailAsync()
        {
            var emailBody = "Sample email sent from the hosted service.";
            var emailSubject = "EdatTemplate Email Notification";
            var emailMessage = new EmailMessage
            {
                Body = emailBody,
                Subject = emailSubject,
                //Tos = 
            };
            await _emailService.SendEmailAsync(emailMessage);
        }
    }
}
