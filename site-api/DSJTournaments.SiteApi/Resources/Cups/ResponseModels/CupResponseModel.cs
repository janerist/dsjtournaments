using System;

namespace DSJTournaments.SiteApi.Resources.Cups.ResponseModels
{
    public class CupResponseModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int GameVersion { get; set; }
        public string RankMethod { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int TournamentCount { get; set; }
        public int CompletedCount { get; set; }

        public CupDateResponseModel[] Dates { get; set; }
    }
}