namespace DSJTournaments.Api.Data.Schema;

[TableName("team_final_results")]
public class TeamFinalResult
{
    public int Id { get; set; }
    public int Rank { get; set; }
    public int? Bib { get; set; }
    public decimal Points { get; set; }
    public int CompetitionId { get; set; }
    public int TeamId { get; set; }
}