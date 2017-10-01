﻿using System.Threading.Tasks;
using DSJTournaments.Mvc.Exceptions;
using DSJTournaments.Mvc.Responses;
using DSJTournaments.SiteApi.Resources.Jumpers.Data;
using DSJTournaments.SiteApi.Resources.Jumpers.RequestModels;
using DSJTournaments.SiteApi.Resources.Jumpers.ResponseModels;

namespace DSJTournaments.SiteApi.Resources.Jumpers.Services
{
    public class JumperService
    {
        private readonly JumperQueries _queries;

        public JumperService(JumperQueries queries)
        {
            _queries = queries;
        }

        public async Task<PagedResponse<JumperResponseModel>> GetPagedJumpers(GetJumpersRequestModel model)
        {
            var (data, count) = await _queries.JumperQuery()
                .Where("j.name ILIKE @Query", new {Query = $"%{model.Q}%"}, onlyIf: !string.IsNullOrWhiteSpace(model.Q))
                .OrderBy(model.Sort)
                .PageAndCountAsync(model.Page, model.PageSize);

            return new PagedResponse<JumperResponseModel>(data, model.Page, model.PageSize, count);
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
            var totalStats = await _queries.StatsQuery()
                .GroupBy("jr.jumper_id")
                .Params(new { JumperId = id })
                .FirstOrDefaultAsync();

            var statsPerType = await _queries.StatsQuery()
                .Select("tt.name AS type, tt.game_version")
                .GroupBy("tt.name, tt.game_version")
                .OrderBy("participations DESC")
                .Params(new { JumperId = id })
                .AllAsync();

            return new JumperAllStatsResponseModel
            {
                Total = totalStats,
                PerType = statsPerType
            };
        }
        
        public async Task<PagedResponse<JumperActivityResponseModel>> GetActivity(int id, int page, int pageSize)
        {
            var (data, count) = await _queries.ActivityQuery()
                .Params(new {JumperId = id})
                .PageAndCountAsync(page, pageSize);

            return new PagedResponse<JumperActivityResponseModel>(data, page, pageSize, count);
        }
    }
}