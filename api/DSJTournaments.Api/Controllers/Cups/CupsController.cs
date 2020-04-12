using System.Threading.Tasks;
using DSJTournaments.Api.Controllers.Cups.RequestModels;
using DSJTournaments.Api.Controllers.Cups.ResponseModels;
using DSJTournaments.Api.Controllers.Cups.Services;
using Microsoft.AspNetCore.Authorization;
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
        public Task<Responses.PagedResponse<CupResponseModel>> GetCups(GetCupsRequestModel model)
        {
            return _cupService.GetCups(model);
        }

        [HttpGet("/cups/{id}")]
        public Task<CupResponseModel> GetCup(int id)
        {
            return _cupService.GetCup(id);
        }

        [HttpGet("/cups/{id}/standings")]
        public Task<Responses.PagedResponse<CupStandingResponseModel>> GetStandings(int id, int page = 1, int pageSize = 100)
        {
            return _cupService.GetStandings(id, page, pageSize);
        }

        [HttpGet("/cups/{id}/rankings")]
        public Task<Responses.PagedResponse<CupRankingsResponseModel>> GetRankings(int id, int page = 1, int pageSize = 100)
        {
            return _cupService.GetRankings(id, page, pageSize);
        }
        
        [Authorize("admin")]
        [HttpPost("/cups")]
        public Task<CupResponseModel> CreateCup([FromBody] CupRequestModel model)
        {
            return _cupService.CreateCup(model);
        }

        [Authorize("admin")]
        [HttpPut("/cups/{id}")]
        public Task<CupResponseModel> UpdateCup(int id, [FromBody] CupRequestModel model)
        {
            return _cupService.UpdateCup(id, model);
        }

        [Authorize("admin")]
        [HttpDelete("/cups/{id}")]
        public Task<CupResponseModel> DeleteCup(int id)
        {
            return _cupService.DeleteCup(id);
        }
    }
}
