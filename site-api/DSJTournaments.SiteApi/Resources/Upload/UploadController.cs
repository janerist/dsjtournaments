using System.Threading.Tasks;
using DSJTournaments.SiteApi.Resources.Upload.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DSJTournaments.SiteApi.Resources.Upload
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
            return Ok(new { Message = "Success"});
        }
    }
}
