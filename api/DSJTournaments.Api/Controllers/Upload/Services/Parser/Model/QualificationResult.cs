namespace DSJTournaments.Api.Controllers.Upload.Services.Parser.Model
{
    public class QualificationResult
    {
        public int? Rank { get; set; }
        public int? Bib { get; set; }
        public string Name { get; set; }
        public string Nation { get; set; }
        public int Rating { get; set; }
        public decimal? Length { get; set; }
        public bool Crashed { get; set; }
        public decimal Points { get; set; }
        public bool Qualified { get; set; }
        public bool PreQualified { get; set; }
        public string Team { get; set; }
    }
}