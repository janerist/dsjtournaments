﻿using System.Threading.Tasks;
using DSJTournaments.AdminApi.Resources.Tournaments.RequestModels;
using DSJTournaments.AdminApi.Resources.Tournaments.ResponseModels;
using DSJTournaments.Data;
using DSJTournaments.Data.Schema;
using DSJTournaments.Mvc.Exceptions;
using DSJTournaments.Mvc.Responses;

namespace DSJTournaments.AdminApi.Resources.Tournaments.Services
{
    public class TournamentService
    {
        private readonly Database _database;

        public TournamentService(Database database)
        {
            _database = database;
        }
        
        public async Task<PagedResponse<TournamentResponseModel>> GetPageOfTournaments(GetTournamentsRequestModel model)
        {
            var (data, count) = await TournamentQuery()
                .OrderBy(model.Sort)
                .PageAndCountAsync(model.Page, model.PageSize);

            return new PagedResponse<TournamentResponseModel>(data, model.Page, model.PageSize, count);
        }
        
        public async Task<TournamentResponseModel> GetTournament(int id)
        {
            var tournament = await TournamentQuery()
                .Where("t.id = @Id", new { Id = id })
                .FirstOrDefaultAsync();

            if (tournament == null)
            {
                throw new NotFoundException();
            }
          
            return tournament;
        }
        
        public async Task<TournamentResponseModel> DeleteTournament(int id)
        {
            var tournament = await GetTournament(id);
            await _database.Delete<Tournament>(tournament.Id);
            return tournament;
        }

        private QueryBuilder<TournamentResponseModel> TournamentQuery()
        {
            return _database.Query<TournamentResponseModel>()
                .Select(
                    "t.id, t.date, t.hill_count, t.game_version, t.tournament_type_id",
                    "tt.name AS type",
                    "(SELECT COUNT(*) FROM final_standings fs WHERE fs.tournament_id = t.id) AS participant_count")
                .From("tournaments t")
                .Join("tournament_types tt ON tt.id = t.tournament_type_id");
        }
    }
}