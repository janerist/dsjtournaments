
namespace DSJTournaments.SiteApi.Resources.Cups.RequestModels
{
    public class GetCupsRequestModel
    {
        public string Season { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}