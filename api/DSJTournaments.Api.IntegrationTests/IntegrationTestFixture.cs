using System;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using DSJTournaments.Api.Controllers.Upload.Services.FileArchive;
using DSJTournaments.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Npgsql;
using Serilog;
using Xunit;

namespace DSJTournaments.Api.IntegrationTests
{
    public class IntegrationTestFixture : WebApplicationFactory<Startup>
    {
        public HttpClient Client { get; }
        public Database Database { get; }
        public FileArchive FileArchive { get; }

        public IntegrationTestFixture()
        {
            Server.PreserveExecutionContext = true;
            
            Client = CreateClient();
            Client.DefaultRequestHeaders.Add("X-Forwarded-For", "127.0.0.1");
            
            Database = Services.GetService<Database>();
            FileArchive = Services.GetService<FileArchive>();

            CreateAndSeedDatabase(Database.ConnectionString);
        }

        protected override IHostBuilder CreateHostBuilder()
        {
            var currentDir = Directory.GetCurrentDirectory();
            return Host.CreateDefaultBuilder(new string[0])
                .ConfigureWebHostDefaults(builder => builder
                    .UseStartup<Startup>()
                    .UseSerilog()
                    .ConfigureAppConfiguration((_, config) => config
                        .AddJsonFile(Path.Combine(currentDir, "appsettings.json")))
                    .UseEnvironment("Test"));
        }

        private void CreateAndSeedDatabase(string connectionString)
        {
            var cnnStringBuilder = new NpgsqlConnectionStringBuilder(connectionString);

            DropAndCreateTestDatabase(cnnStringBuilder);
            CreateSchemaAndSeedData(cnnStringBuilder);
        }

        private void CreateSchemaAndSeedData(NpgsqlConnectionStringBuilder cnnStringBuilder)
        {
            var currentDir = Directory.GetCurrentDirectory();
            var schemaPath = Path.Combine(currentDir,
                "..", "..", "..", "..", "..", "shared", "DSJTournaments.Data", "Scripts", "schema.sql");
            var seedPath = Path.Combine(currentDir,
                "..", "..", "..", "..", "..", "shared", "DSJTournaments.Data", "Scripts", "seed.sql");

            ExecutePsql(
                host: cnnStringBuilder.Host,
                database: cnnStringBuilder.Database,
                file: schemaPath);

            ExecutePsql(
                host: cnnStringBuilder.Host,
                database: cnnStringBuilder.Database,
                file: seedPath);
        }

        private void DropAndCreateTestDatabase(NpgsqlConnectionStringBuilder cnnStringBuilder)
        {
            ExecutePsql(
                host: cnnStringBuilder.Host,
                database: "postgres",
                command: $@"SELECT 
                                pg_terminate_backend(pid) 
                            FROM 
                                pg_stat_activity 
                            WHERE 
                                pid <> pg_backend_pid()
                                AND datname = '{cnnStringBuilder.Database}'");

            ExecutePsql(
                host: cnnStringBuilder.Host,
                database: "postgres",
                command: $"DROP DATABASE IF EXISTS {cnnStringBuilder.Database}");

            ExecutePsql(
                host: cnnStringBuilder.Host,
                database: "postgres",
                command: $"CREATE DATABASE {cnnStringBuilder.Database}");
        }

        private void ExecutePsql(string host, string database, string userName = "postgres", string command = null,
            string file = null)
        {
            var psi = new ProcessStartInfo
            {
                FileName = "docker",
                Arguments = $"exec dsjtournaments-db-1 psql -h {host} -d {database} -U {userName}",
                RedirectStandardOutput = true,
                RedirectStandardError = true
            };

            if (command != null)
            {
                psi.Arguments += $" -c \"{command}\"";
            }
            else if (file != null)
            {
                psi.Arguments += $" -c \"{File.ReadAllText(file)}\"";
            }
            else
            {
                throw new Exception($"{nameof(command)} and {nameof(file)} cannot both be null");
            }

            var process = Process.Start(psi);
            var standardOutput = process.StandardOutput.ReadToEnd();
            var standardError = process.StandardError.ReadToEnd();

            process.WaitForExit();

            if (process.ExitCode != 0)
            {
                throw new Exception(standardOutput + standardError);
            }
        }
    }

    [CollectionDefinition("Integration Tests")]
    public class IntegrationCollection : ICollectionFixture<IntegrationTestFixture>
    {
    }
}