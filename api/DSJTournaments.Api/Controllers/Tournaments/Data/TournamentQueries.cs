using DSJTournaments.Api.Controllers.Tournaments.ResponseModels;
using DSJTournaments.Data;

namespace DSJTournaments.Api.Controllers.Tournaments.Data
{
    public static class TournamentQueries
    {
        public static QueryBuilder<TournamentResponseModel> TournamentQuery(this Database database)
        {
            return database.Query<TournamentResponseModel>()
                .Select(
                    "t.id, t.date, t.hill_count, t.game_version, t.tournament_type_id, t.sub_type",
                    "tt.name AS type",
                    "(SELECT COUNT(*) FROM final_standings fs WHERE fs.tournament_id = t.id) AS participant_count")
                .From("tournaments t")
                .Join("tournament_types tt ON tt.id = t.tournament_type_id");
        }

        public static QueryBuilder<FinalStandingResponseModel> Top3Query(this Database database)
        {
            return database.Query<FinalStandingResponseModel>()
                .SelectDistinct(
                    "top3.*",
                    "j.id AS jumper_id",
                    "j.name AS jumper_name",
                    "j.nation AS jumper_nation",
                    "t.id AS team_id",
                    "t.nation AS team_nation",
                    "t.rank AS team_rank")
                .From("final_standings fs")
                .Join(@"LATERAL (
                            select * from final_standings fs_inner
                            where fs_inner.tournament_id = fs.tournament_id
                            order by fs_inner.rank
                            limit 3
                        ) top3 ON TRUE")
                .OuterJoin("jumpers j ON j.id = top3.jumper_id")
                .OuterJoin("teams t ON t.id = top3.team_id");
        }

        public static QueryBuilder<TournamentTypeWithCountResponseModel> TypesWithCountQuery(this Database database)
        {
            return database.Query<TournamentTypeWithCountResponseModel>()
                .Select(
                    "tt.id, tt.name, tt.game_version",
                    "(SELECT COUNT(t.id) FROM tournaments t WHERE t.tournament_type_id = tt.id) AS count")
                .From("tournament_types tt");
        }

        public static QueryBuilder<CompetitionResponseModel> CompetitionQuery(this Database database)
        {
            return database.Query<CompetitionResponseModel>()
                .Select(
                    "c.id, c.file_number, c.ko",
                    "h.name AS hill_name, h.nation AS hill_nation")
                .From("competitions c")
                .Join("hills h ON h.id = c.hill_id");
        }

        public static QueryBuilder<FinalStandingResponseModel> FinalStandingsQuery(this Database database)
        {
            return database.Query<FinalStandingResponseModel>()
                .Select(
                    "fs.*",
                    "j.id AS jumper_id",
                    "j.name AS jumper_name",
                    "j.nation AS jumper_nation",
                    "t.id AS team_id",
                    "t.nation AS team_nation",
                    "t.rank AS team_rank")
                .From("final_standings fs")
                .OuterJoin("jumpers j ON j.id = fs.jumper_id")
                .OuterJoin("teams t on t.id = fs.team_id")
                .Where("fs.tournament_id = @TournamentId")
                .GroupBy("j.id, fs.id, t.id")
                .OrderBy("fs.rank");
        }

        public static QueryBuilder<TournamentRankingsResponseModel> TournamentRankingsQuery(this Database database)
        {
            return database.Query<TournamentRankingsResponseModel>()
                .Select(
                    "fs.rank",
                    "j.id AS jumper_id",
                    "j.name AS jumper_name",
                    "j.nation AS jumper_nation",
                    "t.id AS team_id",
                    "t.nation AS team_nation",
                    "t.rank AS team_rank",
                    @"jsonb_object_agg(
                        COALESCE(ranks.competition_id, team_ranks.competition_id), 
                        COALESCE(ranks.rank, team_ranks.rank)
                      ) FILTER (WHERE COALESCE(ranks.*, team_ranks.*) IS NOT NULL) as competition_ranks"
                )
                .From("final_standings fs")
                .OuterJoin("jumpers j ON j.id = fs.jumper_id")
                .OuterJoin("teams t on t.id = fs.team_id")
                .OuterJoin(@"LATERAL (
                    SELECT fr.competition_id, fr.rank
                    FROM final_results fr
                    JOIN competitions c ON c.id = fr.competition_id
                    WHERE c.tournament_id = @TournamentId
                    AND fr.jumper_id = j.id
                    AND fr.team_result_id IS NULL
                ) ranks ON TRUE")
                .OuterJoin(@"LATERAL (
                    SELECT fr.competition_id, fr.rank
                    FROM team_final_results fr
                    JOIN competitions c ON c.id = fr.competition_id
                    WHERE c.tournament_id = @TournamentId
                    AND fr.team_id = t.id
                ) team_ranks ON TRUE")
                .Where("fs.tournament_id = @TournamentId")
                .GroupBy("j.id, fs.id, t.id")
                .OrderBy("fs.rank");
        }

        public static QueryBuilder<FinalResultResponseModel> TeamFinalResultsQuery(this Database database)
        {
            return database.Query<FinalResultResponseModel>()
                .Select(
                    "tfr.*",
                    "t.nation AS team_nation",
                    "t.rank AS team_rank")
                .From("team_final_results tfr")
                .Join("teams t ON t.id = tfr.team_id");
        }

        public static QueryBuilder<FinalResultResponseModel> FinalResultsQuery(this Database database)
        {
            return database.Query<FinalResultResponseModel>()
                .Select(
                    "fr.*",
                    "j.name AS jumper_name",
                    "j.nation AS jumper_nation")
                .From("final_results fr")
                .Join("jumpers j ON j.id = fr.jumper_id");
        }

        public static QueryBuilder<QualificationResultResponseModel> QualificationResultsQuery(this Database database)
        {
            return database.Query<QualificationResultResponseModel>()
                .Select(
                    "qr.*",
                    "j.name AS jumper_name",
                    "j.nation AS jumper_nation",
                    "t.id AS team_id",
                    "t.nation AS team_nation",
                    "t.rank AS team_rank")
                .From("qualification_results qr")
                .Join("jumpers j ON j.id = qr.jumper_id")
                .OuterJoin("teams t ON t.id = qr.team_id");
        }
    }
}
