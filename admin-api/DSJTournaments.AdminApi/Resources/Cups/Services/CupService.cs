using System;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;
using DSJTournaments.AdminApi.Resources.Cups.RequestModels;
using DSJTournaments.AdminApi.Resources.Cups.ResponseModels;
using DSJTournaments.Data;
using DSJTournaments.Data.Schema;
using DSJTournaments.Mvc.Exceptions;
using DSJTournaments.Mvc.Responses;

namespace DSJTournaments.AdminApi.Resources.Cups.Services
{
    public class CupService
    {
        private readonly Database _database;

        public CupService(Database database)
        {
            _database = database;
        }
        
        public async Task<PagedResponse<CupResponseModel>> GetCups(int page, int pageSize)
        {
            var (data, count) = await CupsQuery()
                .OrderBy("end_date DESC, c.name DESC")
                .PageAndCountAsync(page, pageSize);

            return new PagedResponse<CupResponseModel>(data, page, pageSize, count);
        }
        
        public async Task<CupResponseModel> GetCup(int id)
        {
            var cup = await CupsQuery()
                .Where("c.id = @Id", new {Id = id})
                .FirstOrDefaultAsync();

            if (cup == null)
            {
                throw new NotFoundException();
            }

            cup.Dates = await CupDatesQuery()
                .Where("cd.cup_id = @Id", new {Id = id})
                .OrderBy("cd.date")
                .AllAsync();

            return cup;
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

        private CupDate ToCupDate(int cupId, CupDateRequestModel model)
        {
            return new CupDate
            {
                Id = model.Id ?? default(int),
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
                GameVersion = model.GameVersion ?? 4
            };
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

        private QueryBuilder<CupResponseModel> CupsQuery()
        {
            return _database.Query<CupResponseModel>()
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

        private QueryBuilder<CupDateResponseModel> CupDatesQuery()
        {
            return _database.Query<CupDateResponseModel>()
                .Select("cd.*")
                .From("cup_dates cd");
        }
    }
}