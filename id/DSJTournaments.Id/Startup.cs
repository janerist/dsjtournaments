using System;
using System.Security.Cryptography.X509Certificates;
using DSJTournaments.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;

namespace DSJTournaments.Id
{
    public class Startup
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _environment;

        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            _configuration = configuration;
            _environment = environment;
        }
        
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            // Identity Server
            var idsrvBuilder = services.AddIdentityServer(options =>
                {
                    options.Endpoints.EnableAuthorizeEndpoint = false;
                    options.Endpoints.EnableIntrospectionEndpoint = false;
                    options.Endpoints.EnableEndSessionEndpoint = false;
                    options.Endpoints.EnableUserInfoEndpoint = false;
                    options.Endpoints.EnableCheckSessionEndpoint = false;
                    options.Endpoints.EnableTokenRevocationEndpoint = false;
                    options.Endpoints.EnableDeviceAuthorizationEndpoint = false;
                })
                .AddResourceOwnerValidator<ResourceOwnerValidator>()
                .AddInMemoryApiResources(IdentityConfig.ApiResources)
                .AddInMemoryClients(IdentityConfig.Clients);

            if (_environment.IsProduction())
            {
                var cert = new X509Certificate2(_configuration["IdentityServer:SigningCertPath"]);
                idsrvBuilder.AddSigningCredential(cert);
            }
            else
            {
                idsrvBuilder.AddDeveloperSigningCredential();
            }
            
            // Database
            services.AddSingleton(_ => new Database(_configuration.GetConnectionString("DSJTournamentsDB")));
            
            // Services
            services.AddSingleton<PasswordHasher>();
            
            // Framework services
            services.AddCors();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app)
        {
            app.UseSerilogRequestLogging();
            
            app.UseCors(builder => builder
                .WithOrigins(_configuration.GetSection("Cors:Origins").Get<string[]>())
                .AllowAnyMethod()
                .AllowAnyHeader()
                .SetPreflightMaxAge(TimeSpan.FromMinutes(10)));
            
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
                RequireHeaderSymmetry = false
            });

            app.UseIdentityServer();
        }
    }
}