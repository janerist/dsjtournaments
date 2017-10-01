namespace DSJTournaments.SiteApi.Resources.Jumpers.RequestModels
{
    public class GetJumpersRequestModel
    {
        public string Q { get; set; }
        public JumperSort? Sort { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 70;
    }
}