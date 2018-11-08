using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using NLog.Web;
using System;

namespace EdatTemplate
{
    public class Program
    {
        public static void Main(string[] args)
        {
            //we need access to the environemt variables before the hosting environemt is constructed to know if we should skip NLog initialization
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            var isDevelopment = environment == EnvironmentName.Development;
            if (!isDevelopment)
            {
                CreateWebHostBuilder(args).Build().Run();
                return;
            }
            var appBasePath = System.IO.Directory.GetCurrentDirectory();
            NLog.GlobalDiagnosticsContext.Set("appbasepath", appBasePath);
            NLogBuilder.ConfigureNLog("nlog.config");
            try
            {
                CreateWebHostBuilder(args).Build().Run();
            }
            finally
            {
                // Ensure to flush and stop internal timers/threads before application-exit (Avoid segmentation fault on Linux)
                NLog.LogManager.Shutdown();
            }
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost
                .CreateDefaultBuilder(args)
                .UseStartup<Startup>();
    }
}
