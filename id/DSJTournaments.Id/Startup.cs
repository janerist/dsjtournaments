﻿using System;
using System.Security.Cryptography.X509Certificates;
using DSJTournaments.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog.Context;

namespace DSJTournaments.Id
{
    public class Startup
    {
        private readonly IConfiguration _configuration;
        private readonly IHostingEnvironment _environment;

        public Startup(IConfiguration configuration, IHostingEnvironment environment)
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
            if (_environment.IsDevelopment())
            {
                //NpgsqlLogManager.Provider = new ConsoleLoggingProvider(NpgsqlLogLevel.Debug, true);
            }
            services.AddSingleton(_ => new Database(_configuration.GetConnectionString("DSJTournamentsDB")));
            
            // Services
            services.AddSingleton<PasswordHasher>();
            
            // Framework services
            services.AddCors();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.Use(async (context, next) =>
            {
                using (LogContext.PushProperty("Request", $"{context.Request.Method} {context.Request.GetDisplayUrl()}"))
                {
                    await next();
                }
            });
            
            app.UseCors(builder => builder
                .WithOrigins(_configuration.GetSection("Cors:Origins").Get<string[]>())
                .AllowAnyMethod()
                .AllowAnyHeader()
                .SetPreflightMaxAge(TimeSpan.FromMinutes(10)));

            app.UseIdentityServer();
            
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor |
                                   ForwardedHeaders.XForwardedProto
            });

            app.Run(async (context) =>
            {
                await context.Response.WriteAsync("Hello World!");
            });
        }
    }
}
