namespace DSJTournaments.Api.Data.Schema
{
    [TableName("qualification_results")]
    public class QualificationResult
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
        public int CompetitionId { get; set; }
        public int JumperId { get; set; }
        public int? TeamId { get; set; }
    }
}