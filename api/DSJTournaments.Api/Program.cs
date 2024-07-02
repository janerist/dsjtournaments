using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.SystemConsole.Themes;

namespace DSJTournaments.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .UseSerilog(ConfigureLogging)
                .ConfigureWebHostDefaults(webBuilder => webBuilder
                    .UseStartup<Startup>());

        private static void ConfigureLogging(HostBuilderContext context, LoggerConfiguration loggerConfiguration)
        {
            var basePath = context.Configuration["Logging:BasePath"];
            var minimumLevel = context.Configuration["Logging:MinimumLevel"];

            const string outputTemplate =
                "[{Timestamp:HH:mm:ss} {Level:u3}] {Message}{NewLine}{Exception}";
            
            loggerConfiguration
                .MinimumLevel.Is(Enum.Parse<LogEventLevel>(minimumLevel))
                .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
                .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
                .WriteTo.Console(outputTemplate: outputTemplate, theme: AnsiConsoleTheme.Literate)
                .WriteTo.File(
                    path: $"{basePath}/api-.log",
                    rollingInterval: RollingInterval.Day,
                    retainedFileCountLimit: 5,
                    outputTemplate: outputTemplate)
                .WriteTo.File(
                    path: $"{basePath}/api-error-.log",
                    rollingInterval: RollingInterval.Day,
                    retainedFileCountLimit: 5,
                    restrictedToMinimumLevel: LogEventLevel.Error,
                    outputTemplate: outputTemplate)
                .Enrich.FromLogContext();
        }
    }
}
