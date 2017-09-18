using System;

namespace DSJTournaments.Api.Data.Schema
{
    [TableName("cup_dates")]
    public class CupDate
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public int CupId { get; set; }
        public int? TournamentId { get; set; }
        public int? TournamentTypeId { get; set; }
        
        [Write(false)]
        public DateTime CreatedAt { get; set; }
        [Write(false)]
        public DateTime UpdatedAt { get; set; }
    }
}