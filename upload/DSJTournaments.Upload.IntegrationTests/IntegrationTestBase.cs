using System;
using System.IO;
using System.Net.Http;
using System.Transactions;
using DSJTournaments.Data;
using DSJTournaments.Upload.Services.FileArchive;
using DSJTournaments.Upload.Services.Processor;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;

namespace DSJTournaments.Upload.IntegrationTests
{
    public abstract class IntegrationTestBase : IDisposable
    {
        protected TestServer Server { get; }
        protected HttpClient Client { get; }
        protected Database Database { get; }
        protected FileArchive FileArchive { get; }

        private readonly TransactionScope _transactionScope;

        protected IntegrationTestBase(IntegrationTestFixture fixture)
        {
            Server = fixture.Server;
            Client = fixture.Client;
            Database = fixture.Database;
            FileArchive = fixture.FileArchive;

            if (Directory.Exists(FileArchive.BasePath))
            {
                Directory.Delete(FileArchive.BasePath, true);
            }
            
            _transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);
            Server.Host.Services.GetService<StatProcessor>().ClearCache();
        }

        public void Dispose()
        {
            _transactionScope.Dispose();
        }
    }
}