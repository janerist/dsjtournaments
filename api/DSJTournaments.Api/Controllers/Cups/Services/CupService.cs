using System;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;
using DSJTournaments.Api.Controllers.Cups.Data;
using DSJTournaments.Api.Controllers.Cups.RequestModels;
using DSJTournaments.Api.Controllers.Cups.ResponseModels;
using DSJTournaments.Api.Exceptions;
using DSJTournaments.Data;
using DSJTournaments.Data.Schema;

namespace DSJTournaments.Api.Controllers.Cups.Services
{
    public class CupService
    {
        private readonly CupQueries _cupQueries;
        private readonly Database _database;

        public CupService(CupQueries cupQueries, Database database)
        {
            _cupQueries = cupQueries;
            _database = database;
        }

        public async Task<Responses.PagedResponse<CupResponseModel>> GetCups(GetCupsRequestModel model)
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

            return new Responses.PagedResponse<CupResponseModel>(data, model.Page, model.PageSize, count);
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

        public async Task<Responses.PagedResponse<CupStandingResponseModel>> GetStandings(int id, int page, int pageSize)
        {
            var (data, count) = await _cupQueries.StandingsQuery()
                .Params(new {CupId = id})
                .PageAndCountAsync(page, pageSize);

            return new Responses.PagedResponse<CupStandingResponseModel>(data, page, pageSize, count);
        }

        public async Task<Responses.PagedResponse<CupRankingsResponseModel>> GetRankings(int id, int page, int pageSize)
        {
            var (data, count) = await _cupQueries.RankingsQuery()
                .Params(new {CupId = id})
                .PageAndCountAsync(page, pageSize);

            return new Responses.PagedResponse<CupRankingsResponseModel>(data, page, pageSize, count);
        }
        
        public async Task<CupResponseModel> CreateCup(CupRequestModel model)
        {
            Cup cup;
            using (var trans = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                cup = await _database.Insert(ToCup(model));

                var cupDates = model.CupDates.Select(cd => ToCupDate(cup.Id, cd)).ToArray();

                await ConnectTournaments(cup.GameVersion, cupDates);

                foreach (var cupDate in cupDates)
                {
                    await _database.Insert(cupDate);
                }

                trans.Complete();
            }

            return await GetCup(cup.Id);
        }

        public async Task<CupResponseModel> UpdateCup(int id, CupRequestModel model)
        {
            var cup = ToCup(model);

            var newCupDates = model.CupDates
                .Where(cd => !cd.Id.HasValue)
                .Select(cd => ToCupDate(id, cd))
                .ToArray();

            var deletedCupDates = model.CupDates
                .Where(cd => cd.Id.HasValue && cd.Destroy)
                .Select(cd => cd.Id.Value)
                .ToArray();

            var updatedCupDates = model.CupDates
                .Where(cd => cd.Id.HasValue && !cd.Destroy)
                .Select(cd => ToCupDate(id, cd))
                .ToArray();

            await ConnectTournaments(cup.GameVersion, newCupDates.Concat(updatedCupDates).ToArray());

            using (var trans = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                await _database.Update<Cup>(id, cup);

                foreach (var cupDate in newCupDates)
                {
                    await _database.Insert(cupDate);
                }

                foreach (var cupDateId in deletedCupDates)
                {
                    await _database.Delete<CupDate>(cupDateId);
                }

                foreach (var cupDate in updatedCupDates)
                {
                    await _database.Update<CupDate>(cupDate.Id, cupDate);
                }

                trans.Complete();
            }

            return await GetCup(id);
        }

        public async Task<CupResponseModel> DeleteCup(int id)
        {
            var cup = await GetCup(id);
            await _database.Delete<Cup>(cup.Id);
            return cup;
        }
        
        private async Task ConnectTournaments(int gameVersion, CupDate[] cupDates)
        {
            var dates = cupDates.Select(cd => cd.Date).ToArray();
            var lookup = (await _database.Query<Tournament>()
                .Where("game_version = @GameVersion", new {GameVersion = gameVersion})
                .Where("date = ANY(@Dates)", new {Dates = dates})
                .AllAsync()).ToLookup(t => t.Date);

            foreach (var cupDate in cupDates)
            {
                if (lookup.Contains(cupDate.Date))
                {
                    var tournaments = lookup[cupDate.Date];
                    if (cupDate.TournamentTypeId.HasValue)
                    {
                        tournaments = tournaments.Where(t => t.TournamentTypeId == cupDate.TournamentTypeId.Value);
                    }

                    var tournament = tournaments.FirstOrDefault();
                    if (tournament != null)
                    {
                        cupDate.TournamentId = tournament.Id;
                    }
                }
            }
        }
        
        private CupDate ToCupDate(int cupId, CupDateRequestModel model)
        {
            return new CupDate
            {
                Id = model.Id ?? default,
                CupId = cupId,
                Date = DateTime.Parse(model.Date + " " + model.Time),
                TournamentTypeId = model.TypeId
            };
        }

        private static Cup ToCup(CupRequestModel model)
        {
            return new Cup
            {
                Name = model.Name,
                RankMethod = model.RankMethod,
                GameVersion = model.GameVersion
            };
        }
    }
}