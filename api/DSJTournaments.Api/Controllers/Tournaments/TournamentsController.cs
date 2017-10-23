using System.Threading.Tasks;
using DSJTournaments.Api.Controllers.Tournaments.RequestModels;
using DSJTournaments.Api.Controllers.Tournaments.ResponseModels;
using DSJTournaments.Api.Controllers.Tournaments.Services;
using DSJTournaments.Mvc.Responses;
using Microsoft.AspNetCore.Mvc;

namespace DSJTournaments.Api.Controllers.Tournaments
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

        [HttpGet("/tournaments/typeswithcount")]
        public Task<TournamentTypeWithCountResponseModel[]> GetTournamentTypesWithCount()
        {
            return _tournamentService.GetTournamentTypesWithCount();
        }

        [HttpGet("/tournaments/{id}")]
        public Task<TournamentResponseModel> GetTournament(int id)
        {
            return _tournamentService.GetTournament(id);
        }

        [HttpGet("/tournaments/{id}/finalstandings")]
        public Task<FinalStandingResponseModel[]> GetFinalStandings(int id)
        {
            return _tournamentService.GetFinalStandings(id);
        }

        [HttpGet("/tournaments/{id}/rankings")]
        public Task<TournamentRankingsResponseModel[]> GetRankings(int id)
        {
            return _tournamentService.GetRankings(id);
        }

        [HttpGet("/competitions/{competitionId}/final")]
        public Task<FinalResultResponseModel[]> GetFinalResults(int competitionId)
        {
            return _tournamentService.GetFinalResults(competitionId);
        }

        [HttpGet("/competitions/{competitionId}/qual")]
        public Task<QualificationResultResponseModel[]> GetQualificationResults(int competitionId)
        {
            return _tournamentService.GetQualificationResults(competitionId);
        }
    }
}
