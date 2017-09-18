namespace DSJTournaments.Api.Data.Schema
{
    [TableName("teams")]
    public class Team
    {
        public int Id { get; set; }
        public string Nation { get; set; }
        public string Rank { get; set; }
    }
}