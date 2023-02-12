using DSJTournaments.Data;
using DSJTournaments.Id.Services;
using Microsoft.AspNetCore.HttpOverrides;
using Serilog;

namespace DSJTournaments.Id;

internal static class HostingExtensions
{
    public static WebApplication ConfigureServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddRazorPages();

        var isBuilder = builder.Services.AddIdentityServer(options =>
        {
            options.Events.RaiseErrorEvents = true;
            options.Events.RaiseInformationEvents = true;
            options.Events.RaiseFailureEvents = true;
            options.Events.RaiseSuccessEvents = true;

            // see https://docs.duendesoftware.com/identityserver/v6/fundamentals/resources/
            options.EmitStaticAudienceClaim = true;
            
            options.Endpoints.EnableIntrospectionEndpoint = false;
            options.Endpoints.EnableCheckSessionEndpoint = false;
            options.Endpoints.EnableTokenRevocationEndpoint = false;
            options.Endpoints.EnableDeviceAuthorizationEndpoint = false;
        });

        // in-memory, code config
        isBuilder.AddInMemoryIdentityResources(Config.IdentityResources);
        isBuilder.AddInMemoryApiScopes(Config.ApiScopes);
        isBuilder.AddInMemoryClients(Config.GetClients(builder.Configuration));

        // if you want to use server-side sessions: https://blog.duendesoftware.com/posts/20220406_session_management/
        // then enable it
        //isBuilder.AddServerSideSessions();
        //
        // and put some authorization on the admin/management pages
        //builder.Services.AddAuthorization(options =>
        //       options.AddPolicy("admin",
        //           policy => policy.RequireClaim("sub", "1"))
        //   );
        //builder.Services.Configure<RazorPagesOptions>(options =>
        //    options.Conventions.AuthorizeFolder("/ServerSideSessions", "admin"));

        builder.Services.AddSingleton(_ => new Database(builder.Configuration.GetConnectionString("DSJTournamentsDB")));
        builder.Services.AddSingleton<PasswordHasher>();
        builder.Services.AddSingleton<IUserService, UserService>();

        builder.Services.AddAuthentication();
        
        builder.Services.AddCors(opts => opts.AddDefaultPolicy(b => b
            .WithOrigins(builder.Configuration.GetSection("Cors:Origins").Get<string[]>())
            .AllowAnyMethod()
            .AllowAnyHeader()
            .SetPreflightMaxAge(TimeSpan.FromMinutes(10))));

        return builder.Build();
    }
    
    public static WebApplication ConfigurePipeline(this WebApplication app)
    { 
        app.UseSerilogRequestLogging();
    
        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseStaticFiles();
        app.UseCors();
        app.UseRouting();


        app.UseForwardedHeaders(new ForwardedHeadersOptions
        {
            ForwardedHeaders = ForwardedHeaders.XForwardedFor |
                               ForwardedHeaders.XForwardedProto
        });
        
        app.UseIdentityServer();
        app.UseAuthorization();
        
        app.MapRazorPages()
            .RequireAuthorization();

        return app;
    }
}