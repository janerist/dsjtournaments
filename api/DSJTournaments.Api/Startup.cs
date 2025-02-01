using System;
using System.Threading.Tasks;
using DSJTournaments.Api.ActionFilters;
using DSJTournaments.Api.Auth;
using DSJTournaments.Api.Controllers.Account.Services;
using DSJTournaments.Api.Controllers.Cups.Services;
using DSJTournaments.Api.Controllers.Jumpers.Services;
using DSJTournaments.Api.Controllers.Results.Services;
using DSJTournaments.Api.Controllers.Tournaments.Services;
using DSJTournaments.Api.Controllers.Upload.Services;
using DSJTournaments.Api.Controllers.Upload.Services.FileArchive;
using DSJTournaments.Api.Controllers.Upload.Services.Parser;
using DSJTournaments.Api.Controllers.Upload.Services.Processor;
using DSJTournaments.Api.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
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

            // Jumpers
            services.AddSingleton<JumperService>();

            // Cups
            services.AddSingleton<CupService>();

            // Results
            services.AddSingleton<ResultService>();

            // Upload
            services.AddSingleton<UploadService>();
            services.AddSingleton<FileArchive>();
            services.AddSingleton<StatParser>();
            services.AddSingleton<StatProcessor>();
            
            // Account
            services.AddSingleton<PasswordHasher>();
            services.AddSingleton<IUserService, UserService>();

            // Framework services
            services.AddCors(opts => opts.AddDefaultPolicy(builder => builder
                .WithOrigins(_configuration.GetSection("Cors:Origins").Get<string[]>())
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
                .SetPreflightMaxAge(TimeSpan.FromMinutes(10))));

            services.AddHttpContextAccessor();

            // Authentication
            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options =>
                {
                    options.ExpireTimeSpan = TimeSpan.FromDays(14);
                    options.SlidingExpiration = false;
                    
                    options.Cookie.Name = "__Host-DSJTournaments";
                    options.Cookie.SameSite = SameSiteMode.Strict;
                    
                    options.Events.OnRedirectToLogin = context =>
                    {
                        context.Response.StatusCode = 401;    
                        return Task.CompletedTask;
                    };
                    options.Events.OnRedirectToAccessDenied = context =>
                    {
                        context.Response.StatusCode = 403;
                        return Task.CompletedTask;
                    };
                });

            // Authorization
            services.AddSingleton<IAuthorizationHandler, CsrfHeaderRequirementHandler>();
            services.AddAuthorizationBuilder()
                .AddPolicy("admin", new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .RequireCsrfHeader()
                    .Build());

            services.AddControllers(opts =>
            {
                opts.Filters.Add(new ModelStateValidationFilterAttribute());
                opts.Filters.Add(new ExceptionHandlerFilterAttribute());
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public virtual void Configure(IApplicationBuilder app, IWebHostEnvironment environment)
        {
            app.UseSerilogRequestLogging();

            if (environment.IsDevelopment())
            {
                app.UseHttpsRedirection();
            }

            app.UseCors();
            app.UseRouting();

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
