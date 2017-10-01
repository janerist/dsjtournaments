﻿namespace DSJTournaments.SiteApi.Resources.Tournaments.ResponseModels
{
    public class FinalResultResponseModel
    {
        public int Id { get; set; }
        public int? Bib { get; set; }
        public int Rank { get; set; }
        public bool? LuckyLoser { get; set; }
        public int? Rating { get; set; }
        public decimal? Length1 { get; set; }
        public decimal? Length2 { get; set; }
        public bool? Crashed1 { get; set; }
        public bool? Crashed2 { get; set; }
        public decimal Points { get; set; }
        
        public int? JumperId { get; set; }
        public string JumperName { get; set; }
        public string JumperNation { get; set; }

        public int? TeamResultId { get; set; }
        public int? TeamId { get; set; }
        public string TeamNation { get; set; }
        public string TeamRank { get; set; }
        public FinalResultResponseModel[] TeamJumpers { get; set; }
    }
}