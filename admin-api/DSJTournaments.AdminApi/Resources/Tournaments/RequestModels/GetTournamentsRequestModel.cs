namespace DSJTournaments.AdminApi.Resources.Tournaments.RequestModels
{
    public class GetTournamentsRequestModel
    {
        public TournamentSort? Sort { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}