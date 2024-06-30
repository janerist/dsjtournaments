using System.Linq;
using System.Threading.Tasks;
using System.Transactions;
using DSJTournaments.Api.Controllers.Cups.Data;
using DSJTournaments.Api.Controllers.Tournaments.Data;
using DSJTournaments.Api.Controllers.Tournaments.RequestModels;
using DSJTournaments.Api.Controllers.Tournaments.ResponseModels;
using DSJTournaments.Api.Exceptions;
using DSJTournaments.Data;
using DSJTournaments.Data.Schema;

namespace DSJTournaments.Api.Controllers.Tournaments.Services
{
    public class TournamentService
    {
        private readonly Database _database;

        public TournamentService(Database database)
        {
            _database = database;
        }

        public async Task<Responses.PagedResponse<TournamentResponseModel>> GetPageOfTournaments(GetTournamentsRequestModel model)
        {
            var (data, count) = await _database.TournamentQuery()
                .Filter("t.tournament_type_id = ANY(@TypeIds)", new { TypeIds = model.Type}, onlyIf: model.Type?.Length > 0)
                .Filter("t.date >= @StartDate", new {StartDate = model.StartDate?.Date}, onlyIf: model.StartDate.HasValue)
                .Filter("t.date < @EndDate", new {EndDate = model.EndDate?.Date.AddDays(1)}, onlyIf: model.EndDate.HasValue)
                .OrderBy(model.Sort)
                .PageAndCountAsync(model.Page, model.PageSize);

            var top3 = (await _database.Top3Query()
                .Where("fs.tournament_id = ANY(@TournamentIds)", new { TournamentIds = data.Select(t => t.Id).ToArray() })
                .OrderBy("top3.tournament_id, top3.rank")
                .AllAsync()).ToLookup(fs => fs.TournamentId);

            foreach (var tournament in data)
            {
                tournament.Top3 = top3.Contains(tournament.Id)
                    ? top3[tournament.Id].ToArray()
                    : new FinalStandingResponseModel[0];
            }

            return new Responses.PagedResponse<TournamentResponseModel>(data, model.Page, model.PageSize, count);
        }

        public async Task<TournamentTypeWithCountResponseModel[]> GetTournamentTypesWithCount()
        {
            return await _database.TypesWithCountQuery()
                .OrderBy("count DESC, name")
                .AllAsync();
        }

        public async Task<TournamentResponseModel> GetTournament(int id)
        {
            var tournament = await _database.TournamentQuery()
                .Where("t.id = @Id", new { Id = id })
                .FirstOrDefaultAsync();

            if (tournament == null)
            {
                throw new NotFoundException();
            }

            tournament.Competitions = await _database.CompetitionQuery()
                .Where("c.tournament_id = @TournamentId", new { TournamentId = id})
                .OrderBy("h.name, c.file_number")
                .AllAsync();

            tournament.Cups = await _database.CupsQuery()
                .Where("cd.tournament_id = @TournamentId", new {TournamentId = id})
                .AllAsync();

            return tournament;
        }

        public Task<FinalStandingResponseModel[]> GetFinalStandings(int id)
        {
            return _database.FinalStandingsQuery()
                .Params(new { TournamentId = id})
                .AllAsync();
        }

        public async Task<FinalResultResponseModel[]> GetFinalResults(int competitionId)
        {
            var teamFinalResults = await _database.TeamFinalResultsQuery()
                .Where("tfr.competition_id = @CompetitionId", new {CompetitionId = competitionId})
                .OrderBy("tfr.rank")
                .AllAsync();

            var finalResults = await _database.FinalResultsQuery()
                .Where("fr.competition_id = @CompetitionId", new {CompetitionId = competitionId})
                .OrderBy("fr.rank")
                .AllAsync();

            if (teamFinalResults.Length > 0)
            {
                foreach (var tfr in teamFinalResults)
                {
                    tfr.TeamJumpers = finalResults
                        .Where(fr => fr.TeamResultId == tfr.Id)
                        .OrderBy(fr => fr.Id)
                        .ToArray();
                }
                return teamFinalResults;
            }

            return finalResults;
        }

        public async Task<QualificationResultResponseModel[]> GetQualificationResults(int competitionId)
        {
            return await _database.QualificationResultsQuery()
                .Where("qr.competition_id = @CompetitionId", new {CompetitionId = competitionId})
                .OrderBy("qr.rank")
                .AllAsync();
        }

        public async Task<TournamentRankingsResponseModel[]> GetRankings(int id)
        {
            return await _database.TournamentRankingsQuery()
                .Params(new {TournamentId = id})
                .AllAsync();
        }

        public async Task<TournamentResponseModel> DeleteTournament(int id)
        {
            var tournament = await GetTournament(id);
            using (var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                await _database.Insert(new DeletedTournament
                {
                    Date = tournament.Date,
                    TournamentTypeId = tournament.TournamentTypeId,
                    SubType = tournament.SubType
                });

                await _database.Delete<Tournament>(tournament.Id);

                transaction.Complete();
            }

            return tournament;
        }
    }
}
