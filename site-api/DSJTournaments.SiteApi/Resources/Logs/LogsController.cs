using DSJTournaments.SiteApi.Resources.Logs.RequestModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace DSJTournaments.SiteApi.Resources.Logs
{
    public class LogsController : Controller
    {
        private readonly ILogger<LogsController> _logger;

        public LogsController(ILogger<LogsController> logger)
        {
            _logger = logger;
        }

        [HttpPost("/logs/error")]
        public void LogError([FromBody]LogRequestModel model)
        {
            _logger.LogError($"{model.ClientId}: {model.Message}\nPath: {model.Path}\n{model.StackTrace}");
        }
    }
}