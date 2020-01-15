using System;
using DSJTournaments.AdminApi.Controllers.Cups.Services;
using DSJTournaments.AdminApi.Controllers.Jumpers.Services;
using DSJTournaments.AdminApi.Controllers.Tournaments.Services;
using DSJTournaments.Data;
using DSJTournaments.Mvc.ActionFilters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;

namespace DSJTournaments.AdminApi
{
    public class Startup
    {
        private readonly IConfiguration _configuration;

        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Database
            services.AddSingleton(_ => new Database(_configuration.GetConnectionString("DSJTournamentsDB")));

            // Tournaments
            services.AddSingleton<TournamentService>();

            // Jumpers
            services.AddSingleton<JumperService>();

            // Cups
            services.AddSingleton<CupService>();

            // Framework services
            services.AddCors();

            services.AddAuthentication("Bearer")
                .AddIdentityServerAuthentication(opts =>
                {
                    opts.Authority = _configuration["IdentityServer:Origin"];
                    opts.RequireHttpsMetadata = false;
                    opts.ApiName = "dsjt";
                });

            services.AddControllers(opts =>
                {
                    var authorizationPolicy = new AuthorizationPolicyBuilder()
                        .RequireAuthenticatedUser()
                        .RequireScope("dsjt")
                        .Build();

                    opts.Filters.Add(new AuthorizeFilter(authorizationPolicy));
                    opts.Filters.Add(new ModelStateValidationFilterAttribute());
                    opts.Filters.Add(new ExceptionHandlerFilterAttribute());
                    opts.Filters.Add(new WrapResultInDataPropertyAttribute());
                })
                .AddNewtonsoftJson();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app)
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
            app.UseEndpoints(endpoints => endpoints.MapControllers());
        }
    }
}