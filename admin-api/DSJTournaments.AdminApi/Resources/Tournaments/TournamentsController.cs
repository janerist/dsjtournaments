using System.Threading.Tasks;
using DSJTournaments.AdminApi.Resources.Tournaments.RequestModels;
using DSJTournaments.AdminApi.Resources.Tournaments.ResponseModels;
using DSJTournaments.AdminApi.Resources.Tournaments.Services;
using DSJTournaments.Mvc.Responses;
using Microsoft.AspNetCore.Mvc;

namespace DSJTournaments.AdminApi.Resources.Tournaments
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
        
        [HttpDelete("/tournaments/{id}")]
        public Task<TournamentResponseModel> DeleteTournament(int id)
        {
            return _tournamentService.DeleteTournament(id);
        }
    }
}