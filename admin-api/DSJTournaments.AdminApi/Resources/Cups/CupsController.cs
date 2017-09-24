using System.Threading.Tasks;
using DSJTournaments.AdminApi.Resources.Cups.RequestModels;
using DSJTournaments.AdminApi.Resources.Cups.ResponseModels;
using DSJTournaments.AdminApi.Resources.Cups.Services;
using DSJTournaments.Mvc.Responses;
using Microsoft.AspNetCore.Mvc;

namespace DSJTournaments.AdminApi.Resources.Cups
{
    public class CupsController : Controller
    {
        private readonly CupService _cupService;

        public CupsController(CupService cupService)
        {
            _cupService = cupService;
        }
        
        [HttpGet("/cups")]
        public Task<PagedResponse<CupResponseModel>> GetCups(int page = 1, int pageSize = 20)
        {
            return _cupService.GetCups(page, pageSize);
        }

        [HttpGet("/cups/{id}")]
        public Task<CupResponseModel> GetCup(int id)
        {
            return _cupService.GetCup(id);
        }

        [HttpPost("/cups")]
        public Task<CupResponseModel> CreateCup([FromBody]CupRequestModel model)
        {
            return _cupService.CreateCup(model);
        }

        [HttpPut("/cups/{id}")]
        public Task<CupResponseModel> UpdateCup(int id, [FromBody] CupRequestModel model)
        {
            return _cupService.UpdateCup(id, model);
        }

        [HttpDelete("/cups/{id}")]
        public Task<CupResponseModel> DeleteCup(int id)
        {
            return _cupService.DeleteCup(id);
        }
    }
}