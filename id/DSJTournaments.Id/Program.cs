using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.SystemConsole.Themes;

namespace DSJTournaments.Id
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => webBuilder
                    .UseStartup<Startup>()
                    .UseSerilog(ConfigureLogging));

        private static void ConfigureLogging(WebHostBuilderContext context, LoggerConfiguration loggerConfiguration)
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
                .WriteTo.RollingFile(
                    pathFormat: $"{basePath}/id-{{Date}}.log",
                    outputTemplate: outputTemplate)
                .WriteTo.RollingFile(
                    pathFormat: $"{basePath}/id-error-{{Date}}.log",
                    restrictedToMinimumLevel: LogEventLevel.Error,
                    outputTemplate: outputTemplate)
                .Enrich.FromLogContext();
        }
    }
}
