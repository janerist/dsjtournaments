namespace DSJTournaments.Api.Controllers.Upload.Services.Parser.Model
{
    public class QualificationStats : Stats<QualificationResult>
    {
        public string Hill { get; set; }
        public bool Knockout { get; set; }
    }
}