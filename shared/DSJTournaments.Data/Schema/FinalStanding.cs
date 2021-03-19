namespace DSJTournaments.Data.Schema
{
    [TableName("final_standings")]
    public class FinalStanding
    {
        public int Id { get; set; }
        public int Rank { get; set; }
        public int? Rating { get; set; }
        public int I { get; set; }
        public int II { get; set; }
        public int III { get; set; }
        public int? N { get; set; }
        public decimal Points { get; set; }
        public int CupPoints { get; set; }
        public int TournamentId { get; set; }
        public int? JumperId { get; set; }
        public int? TeamId { get; set; }
    }
}
