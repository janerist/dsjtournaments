using System;

namespace DSJTournaments.Api.Data.Schema;

[TableName("tournaments")]
public class Tournament
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public int GameVersion { get; set; }
    public int? HillCount { get; set; }
    public int TournamentTypeId { get; set; }
    public string SubType { get; set; }
}