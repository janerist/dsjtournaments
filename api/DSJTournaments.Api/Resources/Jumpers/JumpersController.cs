using System;
using System.Threading.Tasks;
using DSJTournaments.Api.Infrastructure.Responses;
using DSJTournaments.Api.Resources.Jumpers.RequestModels;
using DSJTournaments.Api.Resources.Jumpers.ResponseModels;
using DSJTournaments.Api.Resources.Jumpers.Services;
using IdentityServer4.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DSJTournaments.Api.Resources.Jumpers
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
            return _jumperService.GetPagedJumpers(model, User.IsAuthenticated());
        }

        [HttpGet("/jumpers/{id}")]
        public Task<JumperResponseModel> GetJumper(int id)
        {
            return _jumperService.GetJumper(id, User.IsAuthenticated());
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

        [HttpPut("/jumpers/{id}")]
        [Authorize]
        public Task<JumperResponseModel> UpdateJumper(int id, [FromBody] JumperUpdateRequestModel model)
        {
            return _jumperService.UpdateJumper(id, model);
        }

        [HttpPost("/jumpers/merge")]
        [Authorize]
        public Task<JumperResponseModel> MergeJumpers([FromBody] JumperMergeRequestModel model)
        {
            return _jumperService.MergeJumpers(model);
        }
    }
}
