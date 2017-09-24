namespace DSJTournaments.Data.Schema
{
    [TableName("final_results")]
    public class FinalResult
    {
        public int Id { get; set; }
        public int? Bib { get; set; }
        public int Rank { get; set; }
        public bool LuckyLoser { get; set; }
        public int Rating { get; set; }
        public decimal? Length1 { get; set; }
        public decimal? Length2 { get; set; }
        public bool Crashed1 { get; set; }
        public bool Crashed2 { get; set; }
        public decimal Points { get; set; }
        public int CompetitionId { get; set; }
        public int JumperId { get; set; }
        public int? TeamResultId { get; set; }
    }
}