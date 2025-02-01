using System;

namespace DSJTournaments.Api.Data.Schema;

[TableName("tournament_types")]
public class TournamentType
{
    public int Id { get; set; }        
    public string Name { get; set; }        
    public int GameVersion { get; set; }
        
    [Write(false)]
    public DateTime CreatedAt { get; set; }
    [Write(false)]
    public DateTime UpdatedAt { get; set; }
}