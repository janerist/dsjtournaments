using DSJTournaments.AdminApi.Controllers.Jumpers.RequestModels;
using DSJTournaments.Data;

namespace DSJTournaments.AdminApi.Controllers.Jumpers
{
    public static class JumpersQueryBuilderExtensions
    {
        public static QueryBuilder<T> OrderBy<T>(this QueryBuilder<T> query, JumperSort? sort)
        {
            switch (sort)
            {
                case JumperSort.NameAsc:
                    return query.OrderBy("j.name ASC");

                case JumperSort.NameDesc:
                    return query.OrderBy("j.name DESC");

                case JumperSort.NationAsc:
                    return query.OrderBy("j.nation ASC");

                case JumperSort.NationDesc:
                    return query.OrderBy("j.nation DESC");

                case JumperSort.ParticipationsAsc:
                    return query.OrderBy("participations ASC");

                case JumperSort.ParticipationsDesc:
                    return query.OrderBy("participations DESC");

                case JumperSort.LastActiveAsc:
                    return query.OrderBy("last_active ASC");

                case JumperSort.LastActiveDesc:
                    return query.OrderBy("last_active DESC NULLS LAST");

                default:
                    return query.OrderBy("participations DESC");
            }
        }
    }
}