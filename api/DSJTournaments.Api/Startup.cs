using System;
using System.Security.Cryptography.X509Certificates;
using DSJTournaments.Api.Data;
using DSJTournaments.Api.Identity;
using DSJTournaments.Api.Infrastructure.ActionFilters;
using DSJTournaments.Api.Options;
using DSJTournaments.Api.Resources.Cups.Data;
using DSJTournaments.Api.Resources.Cups.Services;
using DSJTournaments.Api.Resources.Jumpers.Data;
using DSJTournaments.Api.Resources.Jumpers.Services;
using DSJTournaments.Api.Resources.Tournaments.Data;
using DSJTournaments.Api.Resources.Tournaments.Services;
using DSJTournaments.Api.Resources.Upload.Services;
using DSJTournaments.Api.Resources.Upload.Services.Parser;
using DSJTournaments.Api.Resources.Upload.Services.Processor;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql.Logging;
using Serilog.Context;

namespace DSJTournaments.Api
{
    public class Startup
    {
        private readonly IHostingEnvironment _environment;
        private readonly IConfiguration _configuration;

        public Startup(IConfiguration configuration, IHostingEnvironment environment)
        {
            _configuration = configuration;
            _environment = environment;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public virtual void ConfigureServices(IServiceCollection services)
        {
            // Options
            services.AddOptions();
            services.Configure<FileArchiveOptions>(_configuration.GetSection("FileArchive"));
            services.Configure<FormOptions>(opts =>
            {
                opts.MultipartBodyLengthLimit = 1000000;
            });

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

            // Application services

            // Database
            if (_environment.IsDevelopment())
            {
                //NpgsqlLogManager.Provider = new ConsoleLoggingProvider(NpgsqlLogLevel.Debug, true);
            }
            services.AddSingleton(_ => new Database(_configuration.GetConnectionString("DSJTournamentsDB")));

            // Upload
            services.AddSingleton<UploadService>();

            // Tournaments
            services.AddSingleton<TournamentService>();
            services.AddSingleton<TournamentQueries>();

            // Jumpers
            services.AddSingleton<JumperService>();
            services.AddSingleton<JumperQueries>();

            // Cups
            services.AddSingleton<CupService>();
            services.AddSingleton<CupQueries>();

            // Services
            services.AddSingleton<FileArchive>();
            services.AddSingleton<StatParser>();
            services.AddSingleton<StatProcessor>();
            services.AddSingleton<PasswordHasher>();

            // Framework services
            services.AddCors();

            services.AddAuthentication(opts =>
            {
                opts.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opts.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(opts =>
            {
                opts.Authority = _configuration["IdentityServer:Origin"];
                opts.Audience = "dsjt";
                opts.RequireHttpsMetadata = false;
            });

            services.AddMvc(opts =>
            {
                opts.Filters.Add(new ModelStateValidationFilterAttribute());
                opts.Filters.Add(new ExceptionHandlerFilterAttribute());
                opts.Filters.Add(new WrapResultInDataPropertyAttribute());
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public virtual void Configure(IApplicationBuilder app, IHostingEnvironment env)
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

            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor |
                                   ForwardedHeaders.XForwardedProto
            });

            app.Map("/id", a => a.UseIdentityServer());

            app.UseAuthentication();
            app.UseMvc();
        }
    }
}
