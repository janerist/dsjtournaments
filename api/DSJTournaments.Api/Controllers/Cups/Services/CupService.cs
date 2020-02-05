using System;
using System.Linq;
using System.Threading.Tasks;
using DSJTournaments.Api.Controllers.Cups.Data;
using DSJTournaments.Api.Controllers.Cups.RequestModels;
using DSJTournaments.Api.Controllers.Cups.ResponseModels;
using DSJTournaments.Mvc.Exceptions;
using DSJTournaments.Mvc.Responses;
using Newtonsoft.Json;

namespace DSJTournaments.Api.Controllers.Cups.Services
{
    public class CupService
    {
        private readonly CupQueries _cupQueries;

        public CupService(CupQueries cupQueries)
        {
            _cupQueries = cupQueries;
        }

        public async Task<PagedResponse<CupResponseModel>> GetCups(GetCupsRequestModel model)
        {
            DateTime? startDate = null;
            DateTime? endDate = null;

            if (model.Season != null)
            {
                var years = model.Season.Split('-');
                startDate = new DateTime(Convert.ToInt32(years[0]), 11, 1);
                endDate = new DateTime(Convert.ToInt32(years[1]), 10, 31);
            }

            var (data, count) = await _cupQueries.CupsQuery()
                .GroupBy("c.id HAVING MIN(cd.date) > @StartDate AND MAX(cd.date) < @EndDate",
                    new {StartDate = startDate, EndDate = endDate?.AddDays(1)}, onlyIf: startDate.HasValue)
                .OrderBy("end_date DESC, c.name DESC")
                .PageAndCountAsync(model.Page, model.PageSize);

            return new PagedResponse<CupResponseModel>(data, model.Page, model.PageSize, count);
        }

        public async Task<CupResponseModel> GetCup(int id)
        {
            var cup = await _cupQueries.CupsQuery()
                .Where("c.id = @Id", new {Id = id})
                .FirstOrDefaultAsync();

            if (cup == null)
            {
                throw new NotFoundException();
            }

            cup.Dates = await _cupQueries.CupDatesQuery()
                .Where("cd.cup_id = @Id", new {Id = id})
                .OrderBy("cd.date")
                .AllAsync();

            return cup;
        }

        public async Task<PagedResponse<CupStandingResponseModel>> GetStandings(int id, int page, int pageSize)
        {
            var (data, count) = await _cupQueries.StandingsQuery()
                .Params(new {CupId = id})
                .PageAndCountAsync(page, pageSize);

            return new PagedResponse<CupStandingResponseModel>(data, page, pageSize, count);
        }

        public async Task<PagedResponse<CupRankingsResponseModel>> GetRankings(int id, int page, int pageSize)
        {
            var (data, count) = await _cupQueries.RankingsQuery()
                .Params(new {CupId = id})
                .PageAndCountAsync(page, pageSize);

            return new PagedResponse<CupRankingsResponseModel>(data, page, pageSize, count);
        }
    }
}