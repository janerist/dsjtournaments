namespace DSJTournaments.Api.Controllers.Upload.Services.Parser.Model
{
    public class FinalResultStats : Stats<FinalResult>
    {
        public string Hill { get; set; }
        public bool Knockout { get; set; }
    }
}