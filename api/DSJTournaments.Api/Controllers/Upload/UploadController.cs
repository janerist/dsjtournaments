using System.Threading.Tasks;
using DSJTournaments.Api.Controllers.Upload.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DSJTournaments.Api.Controllers.Upload
{
    public class UploadController : Controller
    {
        private readonly UploadService _uploadService;

        public UploadController(UploadService uploadService)
        {
            _uploadService = uploadService;
        }

        [HttpPost("/upload")]
        public async Task<IActionResult> Post(IFormFile file)
        {
            var remoteIp = Request.HttpContext.Connection.RemoteIpAddress;
            await _uploadService.ProcessFile(file, remoteIp);
            return Ok(new { message = "Success"});
        }
    }
}
