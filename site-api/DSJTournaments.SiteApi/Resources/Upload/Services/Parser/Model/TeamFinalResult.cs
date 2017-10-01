namespace DSJTournaments.SiteApi.Resources.Upload.Services.Parser.Model
{
    public class TeamFinalResult
    {
        public int? Rank { get; set; }
        public int Bib { get; set; }
        public string Name { get; set; }
        public string Nation { get; set; }
        public decimal Points { get; set; }
        public FinalResult[] Jumpers { get; set; }
    }
}