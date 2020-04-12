using System;
using DSJTournaments.Api.ActionFilters;
using DSJTournaments.Api.Controllers.Cups.Data;
using DSJTournaments.Api.Controllers.Cups.Services;
using DSJTournaments.Api.Controllers.Jumpers.Data;
using DSJTournaments.Api.Controllers.Jumpers.Services;
using DSJTournaments.Api.Controllers.Results.Services;
using DSJTournaments.Api.Controllers.Tournaments.Data;
using DSJTournaments.Api.Controllers.Tournaments.Services;
using DSJTournaments.Api.Controllers.Upload.Services;
using DSJTournaments.Api.Controllers.Upload.Services.FileArchive;
using DSJTournaments.Api.Controllers.Upload.Services.Parser;
using DSJTournaments.Api.Controllers.Upload.Services.Processor;
using DSJTournaments.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;

namespace DSJTournaments.Api
{
    public class Startup
    {
        private readonly IConfiguration _configuration;

        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public virtual void ConfigureServices(IServiceCollection services)
        {
            // Options
            services.AddOptions();
            services.Configure<FileArchiveOptions>(_configuration.GetSection("FileArchive"));
            
            // Database
            services.AddSingleton(_ => new Database(_configuration.GetConnectionString("DSJTournamentsDB")));

            // Tournaments
            services.AddSingleton<TournamentService>();
            services.AddSingleton<TournamentQueries>();

            // Jumpers
            services.AddSingleton<JumperService>();
            services.AddSingleton<JumperQueries>();

            // Cups
            services.AddSingleton<CupService>();
            services.AddSingleton<CupQueries>();
            
            // Results
            services.AddSingleton<ResultService>();
            
            // Upload
            services.AddSingleton<UploadService>();
            services.AddSingleton<FileArchive>();
            services.AddSingleton<StatParser>();
            services.AddSingleton<StatProcessor>();

            // Framework services
            services.AddCors();
            
            // Authentication
            services.AddAuthentication("Bearer")
                .AddJwtBearer(opts =>
                {
                    opts.Authority = _configuration["IdentityServer:Origin"];
                    opts.RequireHttpsMetadata = false;
                    opts.Audience = "dsjt";
                });
            
            // Authorization
            var adminPolicy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .RequireClaim("scope", "dsjt")
                .Build();

            services.AddAuthorization(opts => opts.AddPolicy("admin", adminPolicy));

            services.AddControllers(opts =>
            {
                opts.Filters.Add(new ModelStateValidationFilterAttribute());
                opts.Filters.Add(new ExceptionHandlerFilterAttribute());
                opts.Filters.Add(new WrapResultInDataPropertyAttribute());
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public virtual void Configure(IApplicationBuilder app)
        {
            app.UseSerilogRequestLogging();
            
            app.UseRouting();
            
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

            app.UseAuthentication();
            app.UseAuthorization();
           
            app.UseEndpoints(endpoints => endpoints.MapControllers());
        }
    }
}
