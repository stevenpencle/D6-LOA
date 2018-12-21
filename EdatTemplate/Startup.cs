using EdatTemplate.Automation;
using EdatTemplate.Infrastructure;
using EdatTemplate.Models.Security;
using EdatTemplate.Models.View;
using EdatTemplate.ORM;
using EdatTemplate.Security;
using EdatTemplate.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace EdatTemplate
{
    public class Startup
    {
        private IConfiguration Configuration { get; }

        private IHostingEnvironment Environment { get; }

        public Startup(IHostingEnvironment environment, IConfiguration configuration)
        {
            Configuration = configuration;
            Environment = environment;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            //add global configuration in case needed
            services.AddSingleton(Configuration);
            //add global Environment in case needed
            services.AddSingleton(Environment);
            //add header configuration for site controller
            var edatHeader = Configuration.GetSection("EdatHeader").Get<EdatHeader>();
            services.AddSingleton(edatHeader);
            //add footer configuration for site controller
            var edatFooter = Configuration.GetSection("EdatFooter").Get<EdatFooter>();
            services.AddSingleton(edatFooter);
            //add azure storage configuration for infrastructure services
            var azureStorageConfig = Configuration.GetSection("AzureStorageConfig").Get<AzureStorageConfig>();
            services.AddSingleton(azureStorageConfig);
            //add storage provider wrapper
            services.AddSingleton<IBlobStorageProvider, BlobStorageProvider>();
            //add send grid configuration for infrastructure services
            var sendGridConfig = Configuration.GetSection("SendGridConfig").Get<SendGridConfig>();
            services.AddSingleton(sendGridConfig);
            //add email service
            services.AddSingleton<IEmailService, EmailService>();
            //add core api configuration for infrastructure services
            var fdotCoreApis = Configuration.GetSection("FdotCoreApis").Get<FdotCoreApis>();
            services.AddSingleton(fdotCoreApis);
            //staff service api wrapper
            services.AddSingleton<IStaffService, StaffService>();
            //add auth provider configuration for security controller
            var authProviderConfig = Configuration.GetSection("Security:AuthProviderConfig").Get<AuthProviderConfig>();
            services.AddSingleton(authProviderConfig);
            //add b2e configuration for security controller
            var openIdConnectB2EOptions = Configuration.GetSection("Security:OpenIdConnectB2EOptions").Get<OpenIdConnectB2EOptions>();
            services.AddSingleton(openIdConnectB2EOptions);
            //add b2c configuration for security controller
            var openIdConnectB2COptions = Configuration.GetSection("Security:OpenIdConnectB2COptions").Get<OpenIdConnectB2COptions>();
            services.AddSingleton(openIdConnectB2COptions);
            //configure identity provider
            var authBuilder = services.AddAuthentication(auth =>
                {
                    auth.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    auth.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
                });
            authBuilder.AddOpenIdConnect(openIdConnectB2EOptions.Scheme, opts =>
            {
                opts.Authority = openIdConnectB2EOptions.Authority;
                opts.ClientId = openIdConnectB2EOptions.ClientId;
                opts.ClientSecret = openIdConnectB2EOptions.ClientSecret;
                opts.Scope.Add(OpenIdConnectScope.OpenIdProfile);
                opts.ResponseType = OpenIdConnectResponseType.CodeIdToken;
                opts.CallbackPath = openIdConnectB2EOptions.CallbackPath;
                opts.TokenValidationParameters = new TokenValidationParameters { ValidateIssuer = false };
                opts.Events = new B2EOpenIdConnectEvents(openIdConnectB2EOptions, new StaffService(fdotCoreApis));
            });
            if (authProviderConfig.AllowB2C)
            {
                authBuilder.AddOpenIdConnect(openIdConnectB2COptions.Scheme, opts =>
                {
                    opts.Authority = openIdConnectB2COptions.Authority + openIdConnectB2COptions.PolicySignInSignUp + "/v2.0";
                    opts.ClientId = openIdConnectB2COptions.ClientId;
                    opts.ClientSecret = openIdConnectB2COptions.ClientSecret;
                    opts.Scope.Add(OpenIdConnectScope.OpenIdProfile);
                    opts.ResponseType = OpenIdConnectResponseType.IdToken;
                    opts.CallbackPath = openIdConnectB2COptions.CallbackPath;
                    opts.SignedOutCallbackPath = @"/dummy";
                    opts.TokenValidationParameters = new TokenValidationParameters { ValidateIssuer = false };
                    opts.Events = new B2COpenIdConnectEvents(openIdConnectB2COptions);
                });
            }
            authBuilder.AddCookie();
            //configure EntityFramework
            var entityFrameworkConfig = Configuration.GetSection("EntityFrameworkConfig").Get<EntityFrameworkConfig>();
            services.AddSingleton(entityFrameworkConfig);
            services.AddDbContext<EntityContext>(optionsBuilder =>
            {
                var connectionString = (Environment.IsDevelopment() && entityFrameworkConfig.UseDocker)
                    ? "DockerDbConnection"
                    : "DbConnection";
                optionsBuilder.UseSqlServer(Configuration.GetConnectionString(connectionString));
            });
            //configure Hosted Srvices
            var automationConfig = Configuration.GetSection("AutomationConfig").Get<AutomationConfig>();
            services.AddSingleton(automationConfig);
            if (automationConfig.RunTasks)
            {
                services.AddHostedService<SampleHostedService>();
            }
            //configure MVC
            services
                .AddMvc()
                .AddJsonOptions(options =>
                {
                    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            //global SPA config
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            //are we using the angular-cli server (VS Code debugging)?
            var usingAngularCliServer = Configuration["node-server"] == "true";
            //optionally drop and recreate local development database
            if (env.IsDevelopment())
            {
                var entityFrameworkConfig = Configuration.GetSection("EntityFrameworkConfig").Get<EntityFrameworkConfig>();
                //drop and create database if needed
                if (entityFrameworkConfig.InitializeDatabase)
                {
                    using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
                    {
                        using (var dbContext = serviceScope.ServiceProvider.GetService<EntityContext>())
                        {
                            dbContext.Database.EnsureDeleted();
                            dbContext.Database.EnsureCreated();
                        }
                    }
                }
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseAuthentication();
            app.UseMvc(routes =>
            {
                routes.MapRoute("default", "{controller}/{action=Index}/{id?}");
            });
            if (!usingAngularCliServer)
            {
                //serve files using IIS express (VS development) or deployed code - static files located in "ClientApp/dist"
                app.UseSpaStaticFiles();
            }
            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";
                if (usingAngularCliServer)
                {
                    //serve files from CLI server (in-memory files when debugging in VS Code)
                    spa.UseAngularCliServer("start");
                }
            });
        }
    }
}
