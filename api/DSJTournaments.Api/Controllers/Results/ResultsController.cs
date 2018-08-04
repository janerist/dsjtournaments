using System.Threading.Tasks;
using DSJTournaments.Api.Controllers.Results.RequestModels;
using DSJTournaments.Api.Controllers.Results.ResponseModels;
using DSJTournaments.Api.Controllers.Results.Services;
using DSJTournaments.Mvc.Responses;
using Microsoft.AspNetCore.Mvc;

namespace DSJTournaments.Api.Controllers.Results
{
    
    public class ResultsController : Controller
    {
        private readonly ResultService _service;

        public ResultsController(ResultService service)
        {
            _service = service;
        }

        [HttpGet("/results")]
        public Task<PagedResponse<ResultResponseModel>> GetResults(GetResultsRequestModel model)
        {
            return _service.GetResults(model);
        }
    }
}