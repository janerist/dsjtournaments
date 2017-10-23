namespace DSJTournaments.Api.Controllers.Jumpers.ResponseModels
{
    public class JumperAllStatsResponseModel
    {
        public JumperStatsResponseModel Total { get; set; }
        public JumperStatsResponseModel[] PerType { get; set; }
    }
}