using System.Collections.Generic;

namespace DSJTournaments.Api.Controllers.Cups.ResponseModels
{
    public class CupRankingsResponseModel
    {
        public int Rank { get; set; }
        public int JumperId { get; set; }
        public string Name { get; set; }
        public string Nation { get; set; }
        public Dictionary<string, int> TournamentRanks { get; set; }
    }
}