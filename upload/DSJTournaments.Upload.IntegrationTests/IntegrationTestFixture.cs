using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using DSJTournaments.Data;
using DSJTournaments.Upload.Services.FileArchive;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;
using Xunit;

namespace DSJTournaments.Upload.IntegrationTests
{
    public class IntegrationTestFixture : ICollectionFixture<WebApplicationFactory<Startup>>
    {
        public TestServer Server => _factory.Server;
        
        public HttpClient Client { get; }
        public Database Database { get; }
        public FileArchive FileArchive { get; }

        private readonly WebApplicationFactory<Startup> _factory;

        public IntegrationTestFixture()
        {
            _factory = new WebApplicationFactory<Startup>().WithWebHostBuilder(b => b
                .ConfigureAppConfiguration((_, config) => config
                    .AddInMemoryCollection(new Dictionary<string, string>
                    {
                        {
                            "FileArchive:BasePath", 
                            @"C:\stats\test"
                        },
                        {
                            "ConnectionStrings:DSJTournamentsDB",
                            "Server=localhost;Port=5432;Database=dsjtournaments_test;Username=postgres"
                        }
                    }))
                .UseEnvironment("Test"));

            Client = _factory.CreateClient();
            Database = Server.Host.Services.GetService<Database>();
            FileArchive = Server.Host.Services.GetService<FileArchive>();

            CreateAndSeedDatabase(Database.ConnectionString);
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

        private void ExecutePsql(string host, string database, string userName = "postgres", string command = null, string file = null)
        {
            var psi = new ProcessStartInfo
            {
                FileName = "psql",
                Arguments = $"-h {host} -d {database} -U {userName}",
                RedirectStandardOutput = true,
                RedirectStandardError = true
            };
            
            if (command != null)
            {
                psi.Arguments += $" -c \"{command}\"";
            }
            else if (file != null)
            {
                psi.Arguments += $" -f \"{file}\"";
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

    [CollectionDefinition("Integration test collection")]
    public class IntegrationTestsCollection : ICollectionFixture<IntegrationTestFixture>
    {
    }
}
