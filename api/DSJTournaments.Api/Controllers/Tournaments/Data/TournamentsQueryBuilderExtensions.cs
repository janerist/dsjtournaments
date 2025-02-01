using DSJTournaments.Api.Controllers.Tournaments.RequestModels;
using DSJTournaments.Api.Data;

namespace DSJTournaments.Api.Controllers.Tournaments.Data
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
                    
                case TournamentSort.TypeAsc:
                    return query.OrderBy("tt.name ASC");

                case TournamentSort.TypeDesc:
                    return query.OrderBy("tt.name DESC");

                default:
                    return query.OrderBy("t.date DESC");
            }
        }
    }
}