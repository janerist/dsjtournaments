namespace DSJTournaments.SiteApi.Resources.Upload.Services.Parser.Model
{
    public class QualificationStats : Stats<QualificationResult>
    {
        public string Hill { get; set; }
        public bool Knockout { get; set; }
    }
}