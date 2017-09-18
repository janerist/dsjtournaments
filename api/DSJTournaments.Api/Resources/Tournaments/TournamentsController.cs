using System.Threading.Tasks;
using DSJTournaments.Api.Infrastructure.Responses;
using DSJTournaments.Api.Resources.Tournaments.RequestModels;
using DSJTournaments.Api.Resources.Tournaments.ResponseModels;
using DSJTournaments.Api.Resources.Tournaments.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DSJTournaments.Api.Resources.Tournaments
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

        [HttpGet("/tournaments/{tournamentId}/competitions/{competitionId}/final")]
        public Task<FinalResultResponseModel[]> GetFinalResults(int tournamentId, int competitionId)
        {
            return _tournamentService.GetFinalResults(tournamentId, competitionId);
        }

        [HttpGet("/tournaments/{tournamentId}/competitions/{competitionId}/qual")]
        public Task<QualificationResultResponseModel[]> GetQualificationResults(int tournamentId, int competitionId)
        {
            return _tournamentService.GetQualificationResults(tournamentId, competitionId);
        }

        [Authorize]
        [HttpDelete("/tournaments/{id}")]
        public Task<TournamentResponseModel> DeleteTournament(int id)
        {
            return _tournamentService.DeleteTournament(id);
        }
    }
}
