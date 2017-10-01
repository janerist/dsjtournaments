namespace DSJTournaments.SiteApi.Resources.Cups.ResponseModels
{
    public class CupStandingResponseModel
    {
        public int Rank { get; set; }
        public int JumperId { get; set; }
        public string Name { get; set; }
        public string Nation { get; set; }
        public int Participations { get; set; }
        public int TotalTournaments { get; set; }
        public int TopRank { get; set; }
        public int TopPoints { get; set; }
        public int I { get; set; }
        public int II { get; set; }
        public int III { get; set; }
        public int CompletedHills { get; set; }
        public int TotalHills { get; set; }
        public int JumpPoints { get; set; }
        public int CupPoints { get; set; }
    }
}