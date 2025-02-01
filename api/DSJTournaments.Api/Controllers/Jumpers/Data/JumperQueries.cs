using DSJTournaments.Api.Controllers.Jumpers.ResponseModels;
using DSJTournaments.Api.Data;

namespace DSJTournaments.Api.Controllers.Jumpers.Data
{
    public static class JumperQueries
    {
        public static QueryBuilder<JumperResponseModel> JumperQuery(this Database database)
        {
            return database.Query<JumperResponseModel>()
                .Select(
                    "j.id, j.name, j.nation, md5(j.gravatar_email) as gravatar_hash",
                    "COUNT(jr.*) AS participations",
                    "MAX(jr.date) AS last_active")
                .From("jumpers j")
                .Join("jumper_results jr ON jr.jumper_id = j.id")
                .GroupBy("j.id");
        }

        public static QueryBuilder<JumperStatsResponseModel> StatsQuery(this Database database, int jumperId)
        {
            return database.Query<JumperStatsResponseModel>()
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
                .Where("jr.jumper_id = @JumperId", new { JumperId = jumperId});
        }

        public static QueryBuilder<JumperActivityResponseModel> ActivityQuery(this Database database, int jumperId)
        {
            return database.Query<JumperActivityResponseModel>()
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
                .Where("jr.jumper_id = @JumperId", new { JumperId = jumperId})
                .OrderBy("t.date DESC");
        }
    }
}
