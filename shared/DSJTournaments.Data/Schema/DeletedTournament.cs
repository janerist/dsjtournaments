using System;

namespace DSJTournaments.Data.Schema
{
    [TableName("deleted_tournaments")]
    public class DeletedTournament
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public int TournamentTypeId { get; set; }
        public string SubType { get; set; }
    }
}