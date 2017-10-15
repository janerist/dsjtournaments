namespace DSJTournaments.Api.Resources.Tournaments.ResponseModels
{
    public class TournamentTypeWithCountResponseModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int GameVersion { get; set; }
        public int Count { get; set; }
    }
}