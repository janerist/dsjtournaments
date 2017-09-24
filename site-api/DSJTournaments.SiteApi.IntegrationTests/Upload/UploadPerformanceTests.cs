using System;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using DSJTournaments.Api.IntegrationTests.Util;
using Xunit;
using Xunit.Abstractions;

namespace DSJTournaments.Api.IntegrationTests.Upload
{
    [Collection("Integration test collection")]
    public class UploadPerformanceTests : IntegrationTestBase
    {
        private readonly ITestOutputHelper _output;

        public UploadPerformanceTests(IntegrationTestFixture fixture, ITestOutputHelper output) : base(fixture)
        {
            _output = output;
        }

        [Theory]
        [InlineData(@"C:\stats\examples\2014-02-07 Marathon A")]
        public async Task UploadEverythingInFolder(string path)
        {
            var files = Directory.GetFiles(path, "*.txt");

            var sw = Stopwatch.StartNew();
            foreach (var file in files)
            {
                var response = await Client.UploadStatsAsync(File.ReadAllText(file), fileName: Path.GetFileName(file));
                await ResponseAssert.Ok(response);
            }

            sw.Stop();

            _output.WriteLine($"Uploaded {files.Length} files in {sw.Elapsed}");
        }
    }
}
