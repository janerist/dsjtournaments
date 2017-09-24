using DSJTournaments.Api.Resources.Tournaments.ResponseModels;
using DSJTournaments.Data;

namespace DSJTournaments.Api.Resources.Tournaments.Data
{
    public class TournamentQueries
    {
        private readonly Database _database;

        public TournamentQueries(Database database)
        {
            _database = database;
        }

        public QueryBuilder<TournamentResponseModel> TournamentQuery()
        {
            return _database.Query<TournamentResponseModel>()
                .Select(
                    "t.id, t.date, t.hill_count, t.game_version, t.tournament_type_id",
                    "tt.name AS type",
                    "(SELECT COUNT(*) FROM final_standings fs WHERE fs.tournament_id = t.id) AS participant_count")
                .From("tournaments t")
                .Join("tournament_types tt ON tt.id = t.tournament_type_id");
        }

        public QueryBuilder<FinalStandingResponseModel> Top3Query()
        {
            return _database.Query<FinalStandingResponseModel>()
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

        public QueryBuilder<TournamentTypeWithCountResponseModel> TypesWithCountQuery()
        {
            return _database.Query<TournamentTypeWithCountResponseModel>()
                .Select(
                    "tt.id, tt.name, tt.game_version",
                    "(SELECT COUNT(t.id) FROM tournaments t WHERE t.tournament_type_id = tt.id) AS count")
                .From("tournament_types tt");
        }

        public QueryBuilder<CompetitionResponseModel> CompetitionQuery()
        {
            return _database.Query<CompetitionResponseModel>()
                .Select(
                    "c.id, c.file_number, c.ko",
                    "h.name AS hill_name, h.nation AS hill_nation")
                .From("competitions c")
                .Join("hills h ON h.id = c.hill_id");
        }

        public QueryBuilder<FinalStandingResponseModel> FinalStandingsQuery()
        {
            return _database.Query<FinalStandingResponseModel>()
                .Select(
                    "fs.*",
                    "j.id AS jumper_id",
                    "j.name AS jumper_name",
                    "j.nation AS jumper_nation",
                    "t.id AS team_id",
                    "t.nation AS team_nation",
                    "t.rank AS team_rank",
                    "jsonb_agg(COALESCE(ranks.*, team_ranks.*)) AS competition_ranks_json")
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

        public QueryBuilder<FinalResultResponseModel> TeamFinalResultsQuery()
        {
            return _database.Query<FinalResultResponseModel>()
                .Select(
                    "tfr.*",
                    "t.nation AS team_nation",
                    "t.rank AS team_rank")
                .From("team_final_results tfr")
                .Join("teams t ON t.id = tfr.team_id");
        }

        public QueryBuilder<FinalResultResponseModel> FinalResultsQuery()
        {
            return _database.Query<FinalResultResponseModel>()
                .Select(
                    "fr.*",
                    "j.name AS jumper_name",
                    "j.nation AS jumper_nation")
                .From("final_results fr")
                .Join("jumpers j ON j.id = fr.jumper_id");
        }

        public QueryBuilder<QualificationResultResponseModel> QualificationResultsQuery()
        {
            return _database.Query<QualificationResultResponseModel>()
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
