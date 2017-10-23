using System;
using DSJTournaments.AdminApi.Controllers.Cups.Services;
using DSJTournaments.AdminApi.Controllers.Jumpers.Services;
using DSJTournaments.AdminApi.Controllers.Tournaments.Services;
using DSJTournaments.Data;
using DSJTournaments.Mvc.ActionFilters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog.Context;

namespace DSJTournaments.AdminApi
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
        public void ConfigureServices(IServiceCollection services)
        {
            // Database
            if (_environment.IsDevelopment())
            {
                //NpgsqlLogManager.Provider = new ConsoleLoggingProvider(NpgsqlLogLevel.Debug, true);
            }
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

            services.AddMvc(opts =>
            {
                var authorizationPolicy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();
                
                opts.Filters.Add(new AuthorizeFilter(authorizationPolicy));
                opts.Filters.Add(new ModelStateValidationFilterAttribute());
                opts.Filters.Add(new ExceptionHandlerFilterAttribute());
                opts.Filters.Add(new WrapResultInDataPropertyAttribute());
            });
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

            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor |
                                   ForwardedHeaders.XForwardedProto
            });

            app.UseAuthentication();
            app.UseMvc();
        }
    }
}
