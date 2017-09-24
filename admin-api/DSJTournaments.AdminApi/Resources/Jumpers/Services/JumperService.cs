using System.Threading.Tasks;
using System.Transactions;
using DSJTournaments.AdminApi.Resources.Jumpers.RequestModels;
using DSJTournaments.AdminApi.Resources.Jumpers.ResponseModels;
using DSJTournaments.Data;
using DSJTournaments.Data.Schema;
using DSJTournaments.Mvc.Exceptions;
using DSJTournaments.Mvc.Responses;

namespace DSJTournaments.AdminApi.Resources.Jumpers.Services
{
    public class JumperService
    {
        private readonly Database _database;

        public JumperService(Database database)
        {
            _database = database;
        }
        
        public async Task<PagedResponse<JumperResponseModel>> GetPagedJumpers(GetJumpersRequestModel model)
        {
            var (data, count) = await JumperQuery()
                .Where("j.name ILIKE @Query", new {Query = $"%{model.Q}%"}, onlyIf: !string.IsNullOrWhiteSpace(model.Q))
                .OrderBy(model.Sort)
                .PageAndCountAsync(model.Page, model.PageSize);

            return new PagedResponse<JumperResponseModel>(data, model.Page, model.PageSize, count);
        }
        
        public async Task<JumperResponseModel> GetJumper(int id)
        {
            var jumper = await JumperQuery()
                .Where("j.id = @Id", new {Id = id})
                .FirstOrDefaultAsync();

            if (jumper == null)
            {
                throw new NotFoundException();
            }

            return jumper;
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
        
        public QueryBuilder<JumperResponseModel> JumperQuery()
        {
            return _database.Query<JumperResponseModel>()
                .Select(
                    "j.id, j.name, j.nation, gravatar_email, md5(j.gravatar_email) as gravatar_hash",
                    "COUNT(jr.*) AS participations",
                    "MAX(jr.date) AS last_active")
                .From("jumpers j")
                .Join("jumper_results jr ON jr.jumper_id = j.id")
                .GroupBy("j.id");
        }
    }
}