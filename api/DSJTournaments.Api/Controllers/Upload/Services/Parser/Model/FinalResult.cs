namespace DSJTournaments.Api.Controllers.Upload.Services.Parser.Model
{
    public class FinalResult
    {
        public int? Rank { get; set; }
        public int? Bib { get; set; }
        public bool LuckyLoser { get; set; }
        public string Name { get; set; }
        public string Nation { get; set; }
        public int Rating { get; set; }
        public decimal? Length1 { get; set; }
        public bool Crashed1 { get; set; }
        public decimal? Length2 { get; set; }
        public bool Crashed2 { get; set; }
        public decimal Points { get; set; }
    }
}