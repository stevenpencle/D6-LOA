using d6loa.Automation;
using d6loa.Infrastructure;
using d6loa.Models.Domain;
using d6loa.Models.Security;
using d6loa.Models.View;
using d6loa.ORM;
using d6loa.Security;
using d6loa.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System;
using System.Linq;

namespace d6loa
{
    public class Startup
    {
        private IConfiguration Configuration { get; }

        private IWebHostEnvironment Environment { get; }

        public Startup(IWebHostEnvironment environment, IConfiguration configuration)
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
            var fdotCoreApisConfig = Configuration.GetSection("FdotCoreApisConfig").Get<FdotCoreApisConfig>();
            services.AddSingleton(fdotCoreApisConfig);
            //add edms api configuration for infrastructure services
            var edmsApiConfig = Configuration.GetSection("EdmsApiConfig").Get<EdmsApiConfig>();
            services.AddSingleton(edmsApiConfig);
            //staff service api wrapper
            services.AddSingleton<IStaffService, StaffService>();
            //edms service api wrapper
            services.AddSingleton<IEdmsService, EdmsService>();
            //signature service api wrapper
            services.AddSingleton<ISignatureService, SignatureService>();
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
                opts.Events = new B2EOpenIdConnectEvents(openIdConnectB2EOptions, new StaffService(fdotCoreApisConfig), sendGridConfig);
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
            //configure Hosted Services
            var automationConfig = Configuration.GetSection("AutomationConfig").Get<AutomationConfig>();
            services.AddSingleton(automationConfig);
            if (automationConfig.RunTasks)
            {
                services.AddHostedService<SampleHostedService>();
            }
            //enable application insights telemetry collection
            services.AddApplicationInsightsTelemetry();
            //configure MVC
            services
                .AddAuthorization(options =>
                    {
                        options.AddPolicy("AdminOrB2C", policy =>
                            policy.RequireClaim(ApplicationClaims.RoleClaim, ApplicationRoles.Admin, ApplicationRoles.B2CUser));
                    }
                )
                .AddMvc(options => options.EnableEndpointRouting = false)
                .AddNewtonsoftJson(options =>
                {
                    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Serialize;
                    options.SerializerSettings.PreserveReferencesHandling = PreserveReferencesHandling.Objects;
                    options.SerializerSettings.TypeNameHandling = TypeNameHandling.Objects;
                });
            //global SPA config
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
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
            app.UseAuthorization();
            app.UseMvcWithDefaultRoute();
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
                    spa.Options.StartupTimeout = new TimeSpan(0, 2, 30);
                    spa.UseAngularCliServer("start");
                }
            });
            //register system user
            using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                using (var dbContext = serviceScope.ServiceProvider.GetService<EntityContext>())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        var systemUser = dbContext.FdotAppUsers.SingleOrDefault(x => x.SrsId == 0);
                        if (systemUser == null)
                        {
                            var sendGridConfig = Configuration.GetSection("SendGridConfig").Get<SendGridConfig>();
                            systemUser = new FdotAppUser
                            {
                                Name = "SYSTEM",
                                Email = sendGridConfig.DoNotReplyEmailAddress,
                                SrsId = 0,
                                District = "CO",
                                RacfId = "SYSTEM"
                            };
                            dbContext.AppUsers.Add(systemUser);
                            dbContext.SaveChanges();
                            transaction.Commit();
                        }
                    }
                }
            }
        }
    }
}
