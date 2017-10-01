using DSJTournaments.Data;
using DSJTournaments.SiteApi.Resources.Jumpers.ResponseModels;

namespace DSJTournaments.SiteApi.Resources.Jumpers.Data
{
    public class JumperQueries
    {
        private readonly Database _database;

        public JumperQueries(Database database)
        {
            _database = database;
        }

        public QueryBuilder<JumperResponseModel> JumperQuery()
        {
            return _database.Query<JumperResponseModel>()
                .Select(
                    "j.id, j.name, j.nation, md5(j.gravatar_email) as gravatar_hash",
                    "COUNT(jr.*) AS participations",
                    "MAX(jr.date) AS last_active")
                .From("jumpers j")
                .Join("jumper_results jr ON jr.jumper_id = j.id")
                .GroupBy("j.id");
        }

        public QueryBuilder<JumperStatsResponseModel> StatsQuery()
        {
            return _database.Query<JumperStatsResponseModel>()
                .Select(
                    "COUNT(jr.*) AS participations",
                    "MIN(jr.rank) AS best_rank",
                    "MAX(jr.rank) AS worst_rank",
                    "AVG(jr.rank) AS avg_rank",
                    "MAX(jr.rating) AS best_rating",
                    "MIN(jr.rating) AS worst_rating",
                    "AVG(jr.rating) AS avg_rating",
                    "MAX(jr.points) AS best_points",
                    "MIN(jr.points) AS worst_points",
                    "AVG(jr.points) AS avg_points")
                .From("tournament_types tt")
                .Join("tournaments t ON t.tournament_type_id = tt.id")
                .Join("jumper_results jr ON jr.tournament_id = t.id")
                .Where("jr.jumper_id = @JumperId");
        }

        public QueryBuilder<JumperActivityResponseModel> ActivityQuery()
        {
            return _database.Query<JumperActivityResponseModel>()
                .Select(
                    "t.id AS tournament_id",
                    "t.date",
                    "t.game_version",
                    "tt.name as tournament_type",
                    "jr.rank",
                    "jr.points"
                )
                .From("tournaments t")
                .Join("tournament_types tt ON tt.id = t.tournament_type_id")
                .Join("jumper_results jr ON jr.tournament_id = t.id")
                .Where("jr.jumper_id = @JumperId")
                .OrderBy("t.date DESC");
        }
    }
}