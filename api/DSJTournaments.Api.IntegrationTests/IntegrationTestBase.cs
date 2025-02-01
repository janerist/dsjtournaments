using System;
using System.IO;
using System.Net.Http;
using System.Transactions;
using DSJTournaments.Api.Controllers.Upload.Services.FileArchive;
using DSJTournaments.Api.Controllers.Upload.Services.Processor;
using DSJTournaments.Api.Data;
using Microsoft.Extensions.DependencyInjection;

namespace DSJTournaments.Api.IntegrationTests
{
    public abstract class IntegrationTestBase : IDisposable
    {
        protected HttpClient Client { get; }
        protected Database Database { get; }
        protected FileArchive FileArchive { get; }

        private readonly TransactionScope _transactionScope;

        protected IntegrationTestBase(IntegrationTestFixture fixture)
        {
            Client = fixture.Client;
            Database = fixture.Database;
            FileArchive = fixture.FileArchive;

            if (Directory.Exists(FileArchive.BasePath))
            {
                Directory.Delete(FileArchive.BasePath, true);
            }
            
            _transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);
            fixture.Services.GetService<StatProcessor>().ClearCache();
        }

        public void Dispose()
        {
            _transactionScope.Dispose();
        }
    }
}