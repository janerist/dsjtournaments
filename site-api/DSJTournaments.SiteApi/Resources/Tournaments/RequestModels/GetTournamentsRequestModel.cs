using System;

namespace DSJTournaments.SiteApi.Resources.Tournaments.RequestModels
{
    public class GetTournamentsRequestModel
    {
        public int? Type { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public TournamentSort? Sort { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}