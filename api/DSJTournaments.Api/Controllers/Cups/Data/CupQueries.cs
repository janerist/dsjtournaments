using DSJTournaments.Api.Controllers.Cups.ResponseModels;
using DSJTournaments.Api.Data;

namespace DSJTournaments.Api.Controllers.Cups.Data
{
    public static class CupQueries
    {
        public static QueryBuilder<CupResponseModel> CupsQuery(this Database database)
        {
            return database.Query<CupResponseModel>()
                .Select(
                    "c.id, c.name, c.game_version, c.rank_method",
                    "COUNT(cd.id) AS tournament_count",
                    "COUNT(cd.id) FILTER (WHERE cd.tournament_id IS NOT NULL) AS completed_count",
                    "MIN(cd.date) AS start_date",
                    "MAX(cd.date) AS end_date")
                .From("cups c")
                .Join("cup_dates cd ON cd.cup_id = c.id")
                .GroupBy("c.id");
        }

        public static QueryBuilder<CupDateResponseModel> CupDatesQuery(this Database database)
        {
            return database.Query<CupDateResponseModel>()
                .Select("cd.*")
                .From("cup_dates cd");
        }

        public static QueryBuilder<CupStandingResponseModel> CupStandingsQuery(this Database database)
        {
            return database.Query<CupStandingResponseModel>()
                .Select(
                    @"CASE WHEN c.rank_method = 'jump_points'
                        THEN (RANK() OVER (ORDER BY SUM(fs.points) DESC))
                        ELSE (RANK() OVER (ORDER BY SUM(fs.cup_points) DESC))
                      END AS rank",
                    "j.id AS jumper_id",
                    "j.name",
                    "j.nation",
                    "COUNT(fs.id) AS participations",
                    "(SELECT COUNT(*) FROM cup_dates WHERE cup_id = @CupId AND tournament_id IS NOT NULL) AS total_tournaments",
                    "MIN(fs.rank) AS top_rank",
                    "MAX(fs.points) AS top_points",
                    "SUM(fs.i) AS i",
                    "SUM(fs.ii) AS ii",
                    "SUM(fs.iii) AS iii",
                    "SUM(fs.n) AS completed_hills",
                    "(SELECT SUM(hill_count) FROM tournaments WHERE id IN (SELECT tournament_id FROM cup_dates WHERE cup_id = @CupId)) AS total_hills",
                    "SUM(fs.points) AS jump_points",
                    "SUM(fs.cup_points) AS cup_points"
                )
                .From("jumpers j")
                .Join("final_standings fs ON fs.jumper_id = j.id")
                .Join("tournaments t ON fs.tournament_id = t.id")
                .Join("cup_dates cd ON cd.tournament_id = t.id")
                .Join("cups c ON c.id = cd.cup_id")
                .Where("c.id = @CupId")
                .GroupBy("j.id, c.id")
                .OrderBy("rank", """
                                 CASE WHEN rank_method = 'jump_points'
                                 THEN SUM(fs.cup_points)
                                 ELSE SUM(fs.points)
                                 END DESC
                                 """);
        }

        public static QueryBuilder<CupRankingsResponseModel> CupRankingsQuery(this Database database)
        {
            return database.Query<CupRankingsResponseModel>()
                .Select(
                    @"CASE WHEN c.rank_method = 'jump_points'
                        THEN (RANK() OVER (ORDER BY SUM(fs.points) DESC))
                        ELSE (RANK() OVER (ORDER BY SUM(fs.cup_points) DESC, SUM(fs.points) DESC))
                      END AS rank",
                    "j.id AS jumper_id",
                    "j.name",
                    "j.nation",
                    "jsonb_object_agg(fs.tournament_id, fs.rank) as tournament_ranks")
                .From("jumpers j")
                .Join("final_standings fs ON fs.jumper_id = j.id")
                .Join("tournaments t ON fs.tournament_id = t.id")
                .Join("cup_dates cd ON cd.tournament_id = t.id")
                .Join("cups c ON c.id = cd.cup_id")
                .Where("c.id = @CupId")
                .GroupBy("j.id, c.id")
                .OrderBy("rank");
        }
    }
}
