namespace DSJTournaments.Upload.Services.Parser.Model
{
    public class StandingStats : Stats<StandingResult>
    {
        public int CompletedHills { get; set; }
        public int TotalHills { get; set; }
    }
}
