using DSJTournaments.Id;
using Serilog;
using Serilog.Events;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

Log.Information("Starting up");

try
{
    var builder = WebApplication.CreateBuilder(args);
    
    var basePath = builder.Configuration["Logging:BasePath"];
    var minimumLevel = builder.Configuration["Logging:MinimumLevel"];
    const string outputTemplate =
        "[{Timestamp:HH:mm:ss} {Level:u3}] {Message}{NewLine}{Exception}";

    builder.Host.UseSerilog((ctx, lc) => lc
        .MinimumLevel.Is(Enum.Parse<LogEventLevel>(minimumLevel))
        .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
        .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
        .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level}] {SourceContext}{NewLine}{Message:lj}{NewLine}{Exception}{NewLine}")
        .WriteTo.File(
            path: $"{basePath}/id-.log",
            outputTemplate: outputTemplate,
            rollingInterval: RollingInterval.Day)
        .WriteTo.File(
            path: $"{basePath}/id-error-.log",
            restrictedToMinimumLevel: LogEventLevel.Error,
            rollingInterval: RollingInterval.Day,
            outputTemplate: outputTemplate)
        .Enrich.FromLogContext());

    var app = builder
        .ConfigureServices()
        .ConfigurePipeline();
    
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Unhandled exception");
}
finally
{
    Log.Information("Shut down complete");
    Log.CloseAndFlush();
}