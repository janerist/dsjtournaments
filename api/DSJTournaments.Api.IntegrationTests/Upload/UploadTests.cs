using System.IO;
using System.Threading.Tasks;
using DSJTournaments.Api.IntegrationTests.Util;
using Xunit;

namespace DSJTournaments.Api.IntegrationTests.Upload
{
    [Collection("Integration test collection")]
    public class UploadTests : IntegrationTestBase
    {
        public UploadTests(IntegrationTestFixture fixture) : base(fixture)
        {
        }

        [Fact]
        public async Task ValidatesFileSize()
        {
            var response = await Client.UploadStatsAsync(new string('a', 1000001));
            var body = await ResponseAssert.BadRequest(response);

            Assert.Equal("File too big (max 1MB)", body.Message);
        }

        [Fact]
        public async Task ValidatesFileExtension()
        {
            var response = await Client.UploadStatsAsync("test", fileName: "test.exe");
            var body = await ResponseAssert.BadRequest(response);

            Assert.Equal("Only text files (.txt) are allowed", body.Message);
        }
        
        [Fact]
        public async Task ValidatesContentType()
        {
            var response = await Client.UploadStatsAsync("test", fileName: "test.txt", contentType: "application/pdf");
            var body = await ResponseAssert.BadRequest(response);

            Assert.Equal("Only content type \"text/plain\" is allowed", body.Message);
        }

        [Fact]
        public async Task SavesFilesThatFailToParseInSeparateFolder()
        {
            var response = await Client.UploadStatsAsync("not going to be able to parse this");
            await ResponseAssert.BadRequest(response);

            var fileOnDisk = Path.Combine(FileArchive.BasePath, "FailedToParse", "test.txt");
            Assert.Equal("not going to be able to parse this", File.ReadAllText(fileOnDisk));
        }
    }
}