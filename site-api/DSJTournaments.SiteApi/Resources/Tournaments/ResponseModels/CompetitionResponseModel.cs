namespace DSJTournaments.SiteApi.Resources.Tournaments.ResponseModels
{
    public class CompetitionResponseModel
    {
        public int Id { get; set; }
        public int FileNumber { get; set; }
        public bool KO { get; set; }
        public string HillName { get; set; }
        public string HillNation { get; set; }
    }
}