using System.Threading.Tasks;
using DSJTournaments.AdminApi.Controllers.Tournaments.RequestModels;
using DSJTournaments.AdminApi.Controllers.Tournaments.ResponseModels;
using DSJTournaments.AdminApi.Controllers.Tournaments.Services;
using DSJTournaments.Mvc.Responses;
using Microsoft.AspNetCore.Mvc;

namespace DSJTournaments.AdminApi.Controllers.Tournaments
{
    public class TournamentsController : Controller
    {
        private readonly TournamentService _tournamentService;

        public TournamentsController(TournamentService tournamentService)
        {
            _tournamentService = tournamentService;
        }

        [HttpGet("/tournaments")]
        public Task<PagedResponse<TournamentResponseModel>> GetTournaments(GetTournamentsRequestModel model)
        {
            return _tournamentService.GetPageOfTournaments(model);
        }
        
        [HttpGet("/tournaments/types")]
        public Task<TournamentTypeResponseModel[]> GetTournamentTypes()
        {
            return _tournamentService.GetTournamentTypes();
        }
        
        [HttpDelete("/tournaments/{id}")]
        public Task<TournamentResponseModel> DeleteTournament(int id)
        {
            return _tournamentService.DeleteTournament(id);
        }
    }
}