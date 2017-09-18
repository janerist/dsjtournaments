using System.Threading.Tasks;
using DSJTournaments.Api.Infrastructure.Responses;
using DSJTournaments.Api.Resources.Cups.RequestModels;
using DSJTournaments.Api.Resources.Cups.ResponseModels;
using DSJTournaments.Api.Resources.Cups.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DSJTournaments.Api.Resources.Cups
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

        [HttpPost("/cups")]
        [Authorize]
        public Task<CupResponseModel> CreateCup([FromBody]CupRequestModel model)
        {
            return _cupService.CreateCup(model);
        }

        [Authorize]
        [HttpPut("/cups/{id}")]
        public Task<CupResponseModel> UpdateCup(int id, [FromBody] CupRequestModel model)
        {
            return _cupService.UpdateCup(id, model);
        }

        [Authorize]
        [HttpDelete("/cups/{id}")]
        public Task<CupResponseModel> DeleteCup(int id)
        {
            return _cupService.DeleteCup(id);
        }
    }
}
