using System;
using System.IO;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using System.Transactions;
using DSJTournaments.Api.Controllers.Upload.Services.Parser;
using DSJTournaments.Api.Controllers.Upload.Services.Parser.Model;
using DSJTournaments.Api.Controllers.Upload.Services.Processor;
using DSJTournaments.Api.Data;
using DSJTournaments.Api.Exceptions;
using Microsoft.AspNetCore.Http;
using Serilog;

namespace DSJTournaments.Api.Controllers.Upload.Services
{
    public class UploadService
    {
        private readonly StatParser _parser;
        private readonly StatProcessor _processor;
        private readonly FileArchive.FileArchive _fileArchive;
        private readonly Database _db;

        public UploadService(StatParser parser, StatProcessor processor, FileArchive.FileArchive fileArchive, Database db)
        {
            _parser = parser;
            _processor = processor;
            _fileArchive = fileArchive;
            _db = db;
        }

        public async Task ProcessFile(IFormFile file, IPAddress remoteIp)
        {
            ValidateFile(file);

            using (var stream = file.OpenReadStream())
            using (var reader = new StreamReader(stream))
            {
                try
                {
                    var statFile = await _parser.Parse(reader);
                    await ProcessInIsolation(statFile, stream, file.FileName, remoteIp);
                }
                catch (StatParserException e)
                {
                    await _fileArchive.ArchiveFile(stream, Path.Combine("FailedToParse", file.FileName));
                    throw new BadRequestException(e.Message);
                }
                catch (StatProcessorException e)
                {
                    throw new BadRequestException(e.Message);
                }
                catch (Exception ex)
                {
                    Log.Error(ex, "Processing failed");
                    await _fileArchive.ArchiveFile(stream, Path.Combine("FailedToProcess", file.FileName));
                    throw new BadRequestException("An unexpected error occurred. Contact the adminstrator.");
                }
            }
        }

        private void ValidateFile(IFormFile file)
        {
            if (file.Length >= 1000000)
            {
                throw new BadRequestException("File too big (max 1MB)");
            }

            if (!file.FileName.EndsWith(".txt"))
            {
                throw new BadRequestException("Only text files (.txt) are allowed");
            }

            if (file.ContentType != "text/plain")
            {
                throw new BadRequestException("Only content type \"text/plain\" is allowed");
            }
        }

        private static readonly SemaphoreSlim SemaphoreSlim = new SemaphoreSlim(1, 1);

        private async Task ProcessInIsolation(Stats statFile, Stream stream, string fileName, IPAddress remoteIp)
        {
            var fileNumber = GetFileNumber(fileName);

            // We only want to process one file at a time
            await SemaphoreSlim.WaitAsync();
            try
            {
                using (var trans = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {
                    await _processor.Process(statFile, fileNumber);

                    var path = Path.Combine($"{statFile.Date:yyyy-MM-dd} {statFile.Type}{(statFile.SubType != null ? " " + statFile.SubType : string.Empty)}", fileName);

                    await _db.Insert(new Data.Schema.Upload
                    {
                        Path = Path.Combine(_fileArchive.BasePath, path),
                        RemoteIp = remoteIp,
                        UploadedAt = DateTime.Now
                    });
                    await _fileArchive.ArchiveFile(stream, path);

                    if (statFile is StandingStats || statFile is TeamFinalResultStats)
                    {
                        await _db.ExecuteAsync("REFRESH MATERIALIZED VIEW jumper_results");
                    }

                    trans.Complete();
                }
            }
            finally
            {
                SemaphoreSlim.Release();
            }
        }

        private static int GetFileNumber(string fileName)
        {
            var match = Regex.Match(fileName, @"\[(?<n>\d+)\]").Groups["n"].Value;
            return Convert.ToInt32(string.IsNullOrEmpty(match) ? "1" : match);
        }
    }
}
