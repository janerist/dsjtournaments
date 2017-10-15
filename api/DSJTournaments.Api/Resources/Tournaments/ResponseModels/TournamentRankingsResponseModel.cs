using System.Collections.Generic;
using Newtonsoft.Json;

namespace DSJTournaments.Api.Resources.Tournaments.ResponseModels
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

        [JsonIgnore]
        public string CompetitionRanksJson { get; set; }
        public Dictionary<int, int> CompetitionRanks { get; set; }
    }
}