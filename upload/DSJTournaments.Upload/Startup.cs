using System;
using DSJTournaments.Data;
using DSJTournaments.Mvc.ActionFilters;
using DSJTournaments.Upload.Controllers.Upload.Services;
using DSJTournaments.Upload.Services.FileArchive;
using DSJTournaments.Upload.Services.Parser;
using DSJTournaments.Upload.Services.Processor;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog.Context;

namespace DSJTournaments.Upload
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
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            // Options
            services.AddOptions();
            services.Configure<FileArchiveOptions>(_configuration.GetSection("FileArchive"));
            services.Configure<FormOptions>(opts => { opts.MultipartBodyLengthLimit = 1000000; });

            // Database
            if (_environment.IsDevelopment())
            {
                //NpgsqlLogManager.Provider = new ConsoleLoggingProvider(NpgsqlLogLevel.Debug, true);
            }

            services.AddSingleton(_ => new Database(_configuration.GetConnectionString("DSJTournamentsDB")));

            // Upload
            services.AddSingleton<UploadService>();

            // Services
            services.AddSingleton<FileArchive>();
            services.AddSingleton<StatParser>();
            services.AddSingleton<StatProcessor>();

            // Framework services
            services.AddCors();

            services.AddMvc(opts =>
                {
                    opts.Filters.Add(new ExceptionHandlerFilterAttribute());
                    opts.Filters.Add(new WrapResultInDataPropertyAttribute());
                })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.Use(async (context, next) =>
            {
                using (LogContext.PushProperty("Request",
                    $"{context.Request.Method} {context.Request.GetDisplayUrl()}"))
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