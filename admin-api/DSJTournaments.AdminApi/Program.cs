using System;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.SystemConsole.Themes;

namespace DSJTournaments.AdminApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args).Run();
        }
        
        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .UseSerilog(ConfigureLogging)
                .Build();

        private static void ConfigureLogging(WebHostBuilderContext context, LoggerConfiguration loggerConfiguration)
        {
            var basePath = context.Configuration["Logging:BasePath"];
            var minimumLevel = context.Configuration["Logging:MinimumLevel"];

            const string outputTemplate =
                "[{Timestamp:HH:mm:ss} {Level:u3}] {Message}{NewLine}{Exception}";
            
            loggerConfiguration
                .MinimumLevel.Is(Enum.Parse<LogEventLevel>(minimumLevel))
                .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
                .MinimumLevel.Override("System", LogEventLevel.Information)
                .WriteTo.Console(outputTemplate: outputTemplate, theme: AnsiConsoleTheme.Literate)
                .WriteTo.RollingFile(
                    pathFormat: $"{basePath}/admin-{{Date}}.log",
                    outputTemplate: outputTemplate)
                .WriteTo.RollingFile(
                    pathFormat: $"{basePath}/admin-error-{{Date}}.log",
                    restrictedToMinimumLevel: LogEventLevel.Error,
                    outputTemplate: outputTemplate)
                .Enrich.FromLogContext();
        }
    }
}
