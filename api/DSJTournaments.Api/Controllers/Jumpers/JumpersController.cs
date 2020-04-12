using System.Threading.Tasks;
using DSJTournaments.Api.Controllers.Jumpers.RequestModels;
using DSJTournaments.Api.Controllers.Jumpers.ResponseModels;
using DSJTournaments.Api.Controllers.Jumpers.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DSJTournaments.Api.Controllers.Jumpers
{
    public class JumpersController : Controller
    {
        private readonly JumperService _jumperService;

        public JumpersController(JumperService jumperService)
        {
            _jumperService = jumperService;
        }

        [HttpGet("/jumpers")]
        public Task<Responses.PagedResponse<JumperResponseModel>> GetJumpers(GetJumpersRequestModel model)
        {
            return _jumperService.GetPagedJumpers(model);
        }

        [HttpGet("/jumpers/{id}")]
        public Task<JumperResponseModel> GetJumper(int id)
        {
            return _jumperService.GetJumper(id);
        }

        [HttpGet("/jumpers/{id}/activity")]
        public Task<Responses.PagedResponse<JumperActivityResponseModel>> GetJumperActivity(int id, int page = 1)
        {
            return _jumperService.GetActivity(id, page, 20);
        }

        [HttpGet("/jumpers/{id}/stats")]
        public Task<JumperAllStatsResponseModel> GetJumperStats(int id)
        {
            return _jumperService.GetTotalStats(id);
        }
        
        [Authorize("admin")]
        [HttpPut("/jumpers/{id}")]
        public Task<JumperResponseModel> UpdateJumper(int id, [FromBody] JumperUpdateRequestModel model)
        {
            return _jumperService.UpdateJumper(id, model);
        }

        [Authorize("admin")]
        [HttpPost("/jumpers/merge")]
        public Task<JumperResponseModel> MergeJumpers([FromBody] JumperMergeRequestModel model)
        {
            return _jumperService.MergeJumpers(model);
        }
    }
}
