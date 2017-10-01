using System.Collections.Generic;
using Newtonsoft.Json;

namespace DSJTournaments.SiteApi.Resources.Cups.ResponseModels
{
    public class CupRankingsResponseModel
    {
        public int Rank { get; set; }
        public int JumperId { get; set; }
        public string Name { get; set; }
        public string Nation { get; set; }

        [JsonIgnore]
        public string TournamentRanksJson { get; set; }
        public Dictionary<int, int> TournamentRanks { get; set; }
    }
}