namespace DSJTournaments.Api.Resources.Tournaments.ResponseModels
{
    public class QualificationResultResponseModel
    {
        public int Id { get; set; }
        public int? Bib { get; set; }
        public int Rank { get; set; }
        public int Rating { get; set; }
        public decimal? Length { get; set; }
        public bool Crashed { get; set; }
        public decimal? Points { get; set; }
        public bool Qualified { get; set; }
        public bool Prequalified { get; set; }

        public int JumperId { get; set; }
        public string JumperName { get; set; }
        public string JumperNation { get; set; }

        public int? TeamId { get; set; }
        public string TeamNation { get; set; }
        public string TeamRank { get; set; }
    }
}