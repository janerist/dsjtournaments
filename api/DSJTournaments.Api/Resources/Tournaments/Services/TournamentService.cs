using System.Linq;
using System.Threading.Tasks;
using DSJTournaments.Api.Resources.Cups.Data;
using DSJTournaments.Api.Resources.Tournaments.Data;
using DSJTournaments.Api.Resources.Tournaments.RequestModels;
using DSJTournaments.Api.Resources.Tournaments.ResponseModels;
using DSJTournaments.Data;
using DSJTournaments.Mvc.Exceptions;
using DSJTournaments.Mvc.Responses;
using Newtonsoft.Json;

namespace DSJTournaments.Api.Resources.Tournaments.Services
{
    public class TournamentService
    {
        private readonly Database _database;
        private readonly TournamentQueries _queries;
        private readonly CupQueries _cupQueries;

        public TournamentService(Database database, TournamentQueries queries, CupQueries cupQueries)
        {
            _database = database;
            _queries = queries;
            _cupQueries = cupQueries;
        }

        public async Task<PagedResponse<TournamentResponseModel>> GetPageOfTournaments(GetTournamentsRequestModel model)
        {
            var (data, count) = await _queries.TournamentQuery()
                .Filter("t.tournament_type_id = @TypeId", new {TypeId = model.Type}, onlyIf: model.Type.HasValue)
                .Filter("t.date >= @StartDate", new {StartDate = model.StartDate?.Date}, onlyIf: model.StartDate.HasValue)
                .Filter("t.date < @EndDate", new {EndDate = model.EndDate?.Date.AddDays(1)}, onlyIf: model.EndDate.HasValue)
                .OrderBy(model.Sort)
                .PageAndCountAsync(model.Page, model.PageSize);

            var top3 = (await _queries.Top3Query()
                .Where("fs.tournament_id = ANY(@TournamentIds)", new { TournamentIds = data.Select(t => t.Id).ToArray() })
                .OrderBy("top3.tournament_id, top3.rank")
                .AllAsync()).ToLookup(fs => fs.TournamentId);

            foreach (var tournament in data)
            {
                tournament.Top3 = top3.Contains(tournament.Id)
                    ? top3[tournament.Id].ToArray()
                    : new FinalStandingResponseModel[0];
            }

            return new PagedResponse<TournamentResponseModel>(data, model.Page, model.PageSize, count);
        }

        public async Task<TournamentTypeWithCountResponseModel[]> GetTournamentTypesWithCount()
        {
            return await _queries.TypesWithCountQuery()
                .OrderBy("count DESC, name")
                .AllAsync();
        }

        public async Task<TournamentResponseModel> GetTournament(int id)
        {
            var tournament = await _queries.TournamentQuery()
                .Where("t.id = @Id", new { Id = id })
                .FirstOrDefaultAsync();

            if (tournament == null)
            {
                throw new NotFoundException();
            }

            tournament.Competitions = await _queries.CompetitionQuery()
                .Where("c.tournament_id = @TournamentId", new { TournamentId = id})
                .OrderBy("h.name, c.file_number")
                .AllAsync();

            tournament.Cups = await _cupQueries.CupsQuery()
                .Where("cd.tournament_id = @TournamentId", new {TournamentId = id})
                .AllAsync();

            return tournament;
        }

        public Task<FinalStandingResponseModel[]> GetFinalStandings(int id)
        {
            return _queries.FinalStandingsQuery()
                .Params(new { TournamentId = id})
                .AllAsync();
        }

        public async Task<FinalResultResponseModel[]> GetFinalResults(int competitionId)
        {
            var teamFinalResults = await _queries.TeamFinalResultsQuery()
                .Where("tfr.competition_id = @CompetitionId", new {CompetitionId = competitionId})
                .OrderBy("tfr.rank")
                .AllAsync();

            var finalResults = await _queries.FinalResultsQuery()
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
            return await _queries.QualificationResultsQuery()
                .Where("qr.competition_id = @CompetitionId", new {CompetitionId = competitionId})
                .OrderBy("qr.rank")
                .AllAsync();
        }

        public async Task<TournamentRankingsResponseModel[]> GetRankings(int id)
        {
            var data = await _queries.RankingsQuery()
                .Params(new {TournamentId = id})
                .AllAsync();

            foreach (var rankings in data)
            {
                rankings.CompetitionRanks = JsonConvert
                    .DeserializeObject<dynamic[]>(rankings.CompetitionRanksJson)
                    .Where(tr => tr != null)
                    .ToDictionary(tr => (int) tr.competition_id, tr => (int) tr.rank);
            }

            return data;
        }
    }
}
