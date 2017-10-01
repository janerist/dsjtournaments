using System.Collections.Generic;
using Newtonsoft.Json;

namespace DSJTournaments.SiteApi.Resources.Tournaments.ResponseModels
{
    public class FinalStandingResponseModel
    {
        public int Id { get; set; }
        public int TournamentId { get; set; }
        public int Rank { get; set; }
        public int Rating { get; set; }
        public int I { get; set; }
        public int II { get; set; }
        public int III { get; set; }
        public int? N { get; set; }
        public int Points { get; set; }
        public double? Avg => N.HasValue ? (double)Points / N : null;

        public int? JumperId { get; set; }
        public string JumperName { get; set; }
        public string JumperNation { get; set; }

        public int? TeamId { get; set; }
        public string TeamNation { get; set; }
        public string TeamRank { get; set; }
    }
}