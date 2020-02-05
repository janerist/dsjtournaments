using System;
using DSJTournaments.Api.Controllers.Cups.Data;
using DSJTournaments.Api.Controllers.Cups.Services;
using DSJTournaments.Api.Controllers.Jumpers.Data;
using DSJTournaments.Api.Controllers.Jumpers.Services;
using DSJTournaments.Api.Controllers.Results.Services;
using DSJTournaments.Api.Controllers.Tournaments.Data;
using DSJTournaments.Api.Controllers.Tournaments.Services;
using DSJTournaments.Data;
using DSJTournaments.Mvc.ActionFilters;
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

            // Framework services
            services.AddCors();

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
           
            app.UseEndpoints(endpoints => endpoints.MapControllers());
        }
    }
}
