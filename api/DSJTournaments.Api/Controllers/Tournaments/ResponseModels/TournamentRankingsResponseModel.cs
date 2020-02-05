using System.Collections.Generic;

namespace DSJTournaments.Api.Controllers.Tournaments.ResponseModels
{
    public class TournamentRankingsResponseModel
    {
        public int Rank { get; set; }
    
        public int? JumperId { get; set; }
        public string JumperName { get; set; }
        public string JumperNation { get; set; }

        public int? TeamId { get; set; }
        public string TeamNation { get; set; }
        public string TeamRank { get; set; }

        public Dictionary<string, int> CompetitionRanks { get; set; }
    }
}