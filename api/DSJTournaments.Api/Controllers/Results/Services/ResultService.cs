using System.Linq;
using System.Threading.Tasks;
using DSJTournaments.Api.Controllers.Results.RequestModels;
using DSJTournaments.Api.Controllers.Results.ResponseModels;
using DSJTournaments.Api.Controllers.Tournaments.Data;
using DSJTournaments.Data;

namespace DSJTournaments.Api.Controllers.Results.Services
{
    public class ResultService
    {
        private readonly Database _database;
        private readonly TournamentQueries _tournamentQueries;

        public ResultService(Database database, TournamentQueries tournamentQueries)
        {
            _database = database;
            _tournamentQueries = tournamentQueries;
        }

        public async Task<Responses.PagedResponse<ResultResponseModel>> GetResults(GetResultsRequestModel model)
        {
            var tournaments = await _tournamentQueries.TournamentQuery()
                .Filter("t.game_version = @GameVersion", 
                    new { GameVersion = model.GameVersion},
                    onlyIf: model.GameVersion.HasValue)
                .Filter("tt.id = @Type",
                    new {Type = model.Type},
                    onlyIf: model.Type.HasValue)
                .Filter("t.date >= @DateFrom",
                    new {DateFrom = model.DateFrom},
                    onlyIf: model.DateFrom.HasValue)
                .Filter("t.date <= @DateTo + interval '1 day'",
                    new {DateTo = model.DateTo},
                    onlyIf: model.DateTo.HasValue)
                .AllAsync();

            var (data, count) = await _database.Query<ResultResponseModel>()
                .Select(
                    @"CASE WHEN @RankMethod = 'jump_points'
                        THEN (RANK() OVER (ORDER BY SUM(fs.points) DESC))
                        ELSE (RANK() OVER (ORDER BY SUM(fs.cup_points) DESC, SUM(fs.points) DESC))
                      END AS rank",
                    "j.id AS jumper_id",
                    "j.name",
                    "j.nation",
                    "COUNT(fs.id) AS participations",
                    $"{tournaments.Length} AS total_tournaments",
                    "COUNT(*) FILTER (WHERE fs.rank = 1) AS first_places",
                    "COUNT(*) FILTER (WHERE fs.rank = 2) AS second_places",
                    "COUNT(*) FILTER (WHERE fs.rank = 3) AS third_places",
                    "COUNT(*) FILTER (WHERE fs.rank <= 10) AS top_10",
                    "COUNT(*) FILTER (WHERE fs.rank <= 30) AS top_30",
                    "SUM(fs.i) AS i",
                    "SUM(fs.ii) AS ii",
                    "SUM(fs.iii) AS iii",
                    "SUM(fs.n) AS completed_hills",
                    $"{tournaments.Sum(t => t.HillCount)} AS total_hills",
                    "SUM(fs.points) AS jump_points",
                    "SUM(fs.cup_points) AS cup_points"
                )
                .From("jumpers j")
                .Join("final_standings fs ON fs.jumper_id = j.id")
                .Filter("fs.tournament_id = ANY(@TournamentIds)",
                    new {TournamentIds = tournaments.Select(t => t.Id).ToArray()})
                .GroupBy("j.id")
                .OrderBy("rank")
                .Params(new {RankMethod = model.RankMethod})
                .PageAndCountAsync(model.Page, model.PageSize);

            return new Responses.PagedResponse<ResultResponseModel>(data, model.Page, model.PageSize, count);
        }
    }
}
