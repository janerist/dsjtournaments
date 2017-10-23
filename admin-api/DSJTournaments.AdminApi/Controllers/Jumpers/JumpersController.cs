using System.Threading.Tasks;
using DSJTournaments.AdminApi.Controllers.Jumpers.RequestModels;
using DSJTournaments.AdminApi.Controllers.Jumpers.ResponseModels;
using DSJTournaments.AdminApi.Controllers.Jumpers.Services;
using DSJTournaments.Mvc.Responses;
using Microsoft.AspNetCore.Mvc;

namespace DSJTournaments.AdminApi.Controllers.Jumpers
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

        [HttpPut("/jumpers/{id}")]
        public Task<JumperResponseModel> UpdateJumper(int id, [FromBody] JumperUpdateRequestModel model)
        {
            return _jumperService.UpdateJumper(id, model);
        }

        [HttpPost("/jumpers/merge")]
        public Task<JumperResponseModel> MergeJumpers([FromBody] JumperMergeRequestModel model)
        {
            return _jumperService.MergeJumpers(model);
        }
    }
}