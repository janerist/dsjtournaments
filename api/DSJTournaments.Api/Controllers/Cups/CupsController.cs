using System.Threading.Tasks;
using DSJTournaments.Api.Controllers.Cups.RequestModels;
using DSJTournaments.Api.Controllers.Cups.ResponseModels;
using DSJTournaments.Api.Controllers.Cups.Services;
using DSJTournaments.Mvc.Responses;
using Microsoft.AspNetCore.Mvc;

namespace DSJTournaments.Api.Controllers.Cups
{
    public class CupsController : Controller
    {
        private readonly CupService _cupService;

        public CupsController(CupService cupService)
        {
            _cupService = cupService;
        }

        [HttpGet("/cups")]
        public Task<PagedResponse<CupResponseModel>> GetCups(GetCupsRequestModel model)
        {
            return _cupService.GetCups(model);
        }

        [HttpGet("/cups/{id}")]
        public Task<CupResponseModel> GetCup(int id)
        {
            return _cupService.GetCup(id);
        }

        [HttpGet("/cups/{id}/standings")]
        public Task<PagedResponse<CupStandingResponseModel>> GetStandings(int id, int page = 1, int pageSize = 100)
        {
            return _cupService.GetStandings(id, page, pageSize);
        }

        [HttpGet("/cups/{id}/rankings")]
        public Task<PagedResponse<CupRankingsResponseModel>> GetRankings(int id, int page = 1, int pageSize = 100)
        {
            return _cupService.GetRankings(id, page, pageSize);
        }
    }
}
