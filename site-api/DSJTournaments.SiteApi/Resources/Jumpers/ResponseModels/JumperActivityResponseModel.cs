using System;

namespace DSJTournaments.SiteApi.Resources.Jumpers.ResponseModels
{
    public class JumperActivityResponseModel
    {
        public DateTime Date { get; set; }
        public int TournamentId { get; set; }
        public int GameVersion { get; set; }
        public string TournamentType { get; set; }
        public int? Rank { get; set; }
        public int? Points { get; set; }
    }
}