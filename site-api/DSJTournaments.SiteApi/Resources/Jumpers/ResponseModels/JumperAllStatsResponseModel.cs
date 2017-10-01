namespace DSJTournaments.SiteApi.Resources.Jumpers.ResponseModels
{
    public class JumperAllStatsResponseModel
    {
        public JumperStatsResponseModel Total { get; set; }
        public JumperStatsResponseModel[] PerType { get; set; }
    }
}