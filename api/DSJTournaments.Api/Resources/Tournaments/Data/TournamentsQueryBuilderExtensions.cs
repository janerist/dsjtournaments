using DSJTournaments.Api.Resources.Tournaments.RequestModels;
using DSJTournaments.Data;

namespace DSJTournaments.Api.Resources.Tournaments.Data
{
    public static class TournamentsQueryBuilderExtensions
    {
        public static QueryBuilder<T> OrderBy<T>(this QueryBuilder<T> query, TournamentSort? sort)
        {
            switch (sort)
            {
                case TournamentSort.DateAsc:
                    return query.OrderBy("t.date ASC");

                case TournamentSort.DateDesc:
                    return query.OrderBy("t.date DESC");

                case TournamentSort.HillCountAsc:
                    return query.OrderBy("t.hill_count ASC NULLS FIRST");

                case TournamentSort.HillCountDesc:
                    return query.OrderBy("t.hill_count DESC NULLS LAST");

                case TournamentSort.ParticipantsAsc:
                    return query.OrderBy("participant_count ASC NULLS FIRST");

                case TournamentSort.ParticipantsDesc:
                    return query.OrderBy("participant_count DESC NULLS LAST");

                default:
                    return query.OrderBy("t.date DESC");
            }
        }
    }
}