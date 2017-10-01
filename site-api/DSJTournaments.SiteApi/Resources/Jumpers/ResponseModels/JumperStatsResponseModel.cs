namespace DSJTournaments.SiteApi.Resources.Jumpers.ResponseModels
{
    public class JumperStatsResponseModel
    {
        public string Type { get; set; }
        public int GameVersion { get; set; }

        public int Participations { get; set; }

        public int? BestRank { get; set; }
        public int? WorstRank { get; set; }
        public int? AvgRank { get; set; }

        public int? BestRating { get; set; }
        public int? WorstRating { get; set; }
        public int? AvgRating { get; set; }

        public int? BestPoints { get; set; }
        public int? WorstPoints { get; set; }
        public int? AvgPoints { get; set; }
    }
}