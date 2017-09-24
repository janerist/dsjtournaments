namespace DSJTournaments.Data.Schema
{
    [TableName("competitions")]
    public class Competition
    {
        public int Id { get; set; }
        public int FileNumber { get; set; }
        public bool KO { get; set; }
        public int HillId { get; set; }
        public int TournamentId { get; set; }
    }
}