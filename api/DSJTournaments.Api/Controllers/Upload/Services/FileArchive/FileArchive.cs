using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;

namespace DSJTournaments.Api.Controllers.Upload.Services.FileArchive
{
    public class FileArchive
    {
        public string BasePath { get; }

        public FileArchive(IOptions<FileArchiveOptions> options)
        {
            BasePath = options.Value.BasePath;
        }

        public async Task<string> ArchiveFile(Stream fileStream, string subPath)
        {
            var path = Path.Combine(BasePath, subPath);
            Directory.CreateDirectory(Path.GetDirectoryName(path));
            using (var archiveFile = File.Create(path))
            {
                fileStream.Position = 0;
                await fileStream.CopyToAsync(archiveFile);
            }

            return path;
        }
    }
}