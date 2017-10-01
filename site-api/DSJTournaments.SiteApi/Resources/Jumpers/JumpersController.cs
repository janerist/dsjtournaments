using System.Threading.Tasks;
using DSJTournaments.Mvc.Responses;
using DSJTournaments.SiteApi.Resources.Jumpers.RequestModels;
using DSJTournaments.SiteApi.Resources.Jumpers.ResponseModels;
using DSJTournaments.SiteApi.Resources.Jumpers.Services;
using Microsoft.AspNetCore.Mvc;

namespace DSJTournaments.SiteApi.Resources.Jumpers
{
    public class JumpersController : Controller
    {
        private readonly JumperService _jumperService;

        public JumpersController(JumperService jumperService)
        {
            _jumperService = jumperService;
        }

        [HttpGet("/jumpers")]
        public Task<PagedResponse<JumperResponseModel>> GetJumpers(GetJumpersRequestModel model)
        {
            return _jumperService.GetPagedJumpers(model);
        }

        [HttpGet("/jumpers/{id}")]
        public Task<JumperResponseModel> GetJumper(int id)
        {
            return _jumperService.GetJumper(id);
        }

        [HttpGet("/jumpers/{id}/activity")]
        public Task<PagedResponse<JumperActivityResponseModel>> GetJumperActivity(int id, int page = 1)
        {
            return _jumperService.GetActivity(id, page, 20);
        }

        [HttpGet("/jumpers/{id}/stats")]
        public Task<JumperAllStatsResponseModel> GetJumperStats(int id)
        {
            return _jumperService.GetTotalStats(id);
        }
    }
}
