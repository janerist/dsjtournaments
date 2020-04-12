using System.Threading.Tasks;
using System.Transactions;
using DSJTournaments.Api.Controllers.Jumpers.Data;
using DSJTournaments.Api.Controllers.Jumpers.RequestModels;
using DSJTournaments.Api.Controllers.Jumpers.ResponseModels;
using DSJTournaments.Api.Exceptions;
using DSJTournaments.Data;
using DSJTournaments.Data.Schema;

namespace DSJTournaments.Api.Controllers.Jumpers.Services
{
    public class JumperService
    {
        private readonly JumperQueries _queries;
        private readonly Database _database;

        public JumperService(JumperQueries queries, Database database)
        {
            _queries = queries;
            _database = database;
        }

        public async Task<Responses.PagedResponse<JumperResponseModel>> GetPagedJumpers(GetJumpersRequestModel model)
        {
            var (data, count) = await _queries.JumperQuery()
                .Where("j.name ILIKE @Query", new {Query = $"%{model.Q}%"}, onlyIf: !string.IsNullOrWhiteSpace(model.Q))
                .OrderBy(model.Sort)
                .PageAndCountAsync(model.Page, model.PageSize);

            return new Responses.PagedResponse<JumperResponseModel>(data, model.Page, model.PageSize, count);
        }

        public async Task<JumperResponseModel> GetJumper(int id)
        {
            var jumper = await _queries.JumperQuery()
                .Where("j.id = @Id", new {Id = id})
                .FirstOrDefaultAsync();

            if (jumper == null)
            {
                throw new NotFoundException();
            }

            return jumper;
        }

        public async Task<JumperAllStatsResponseModel> GetTotalStats(int id)
        {
            var totalStats = await _queries.StatsQuery(id)
                .GroupBy("jr.jumper_id")
                .FirstOrDefaultAsync();

            var statsPerType = await _queries.StatsQuery(id)
                .Select("tt.name AS type, tt.game_version")
                .GroupBy("tt.name, tt.game_version")
                .OrderBy("participations DESC")
                .AllAsync();

            return new JumperAllStatsResponseModel
            {
                Total = totalStats,
                PerType = statsPerType
            };
        }
        
        public async Task<Responses.PagedResponse<JumperActivityResponseModel>> GetActivity(int id, int page, int pageSize)
        {
            var (data, count) = await _queries.ActivityQuery(id)
                .PageAndCountAsync(page, pageSize);

            return new Responses.PagedResponse<JumperActivityResponseModel>(data, page, pageSize, count);
        }
        
        public async Task<JumperResponseModel> UpdateJumper(int id, JumperUpdateRequestModel model)
        {
            await _database.Update<Jumper>(id, new {model.Nation, model.GravatarEmail});
            return await GetJumper(id);
        }

        public async Task<JumperResponseModel> MergeJumpers(JumperMergeRequestModel model)
        {
            using (var trans = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                foreach (var sourceJumperId in model.SourceJumperIds)
                {
                    await _database.ExecuteAsync(@"
                        UPDATE final_standings SET jumper_id = @DestinationJumperId WHERE jumper_id = @SourceJumperId;
                        UPDATE final_results SET jumper_id = @DestinationJumperId WHERE jumper_id = @SourceJumperId;
                        UPDATE qualification_results SET jumper_id = @DestinationJumperId WHERE jumper_id = @SourceJumperId;
                        ", new {DestinationJumperId = model.DestinationJumperId, SourceJumperId = sourceJumperId});
                    await _database.Delete<Jumper>(sourceJumperId);
                }
                
                await _database.ExecuteAsync("REFRESH MATERIALIZED VIEW jumper_results");

                trans.Complete();
            }

            return await GetJumper(model.DestinationJumperId);
        }
    }
}