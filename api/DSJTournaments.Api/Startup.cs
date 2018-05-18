﻿using System;
using DSJTournaments.Api.Controllers.Cups.Data;
using DSJTournaments.Api.Controllers.Cups.Services;
using DSJTournaments.Api.Controllers.Jumpers.Data;
using DSJTournaments.Api.Controllers.Jumpers.Services;
using DSJTournaments.Api.Controllers.Tournaments.Data;
using DSJTournaments.Api.Controllers.Tournaments.Services;
using DSJTournaments.Data;
using DSJTournaments.Mvc.ActionFilters;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
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
            // Application services

            // Database
            if (_environment.IsDevelopment())
            {
                //NpgsqlLogManager.Provider = new ConsoleLoggingProvider(NpgsqlLogLevel.Debug, true);
            }
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

            // Framework services
            services.AddCors();

            services.AddMvc(opts =>
                {
                    opts.Filters.Add(new ModelStateValidationFilterAttribute());
                    opts.Filters.Add(new ExceptionHandlerFilterAttribute());
                    opts.Filters.Add(new WrapResultInDataPropertyAttribute());
                })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
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
           
            app.UseMvc();
        }
    }
}
