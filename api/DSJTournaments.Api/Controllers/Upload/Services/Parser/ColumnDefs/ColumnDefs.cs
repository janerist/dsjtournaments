using System;
using DSJTournaments.Api.Controllers.Upload.Services.Parser.Model;

namespace DSJTournaments.Api.Controllers.Upload.Services.Parser.ColumnDefs
{
    public class StandingsColumnDef : ColumnDef<StandingResult>
    {
        public StandingsColumnDef()
        {
            ColumnFor(x => x.Rank, (0, 6), CellValueParsers.ParseRank);
            ColumnFor(x => x.Name, (6, 25));
            ColumnFor(x => x.Nation, (31, 3));
            ColumnFor(x => x.Rating, (44, 4), CellValueParsers.ParseRating);
            ColumnFor(x => x.I, (48, 6), CellValueParsers.ParsePodium);
            ColumnFor(x => x.II, (54, 6), CellValueParsers.ParsePodium);
            ColumnFor(x => x.III, (60, 6), CellValueParsers.ParsePodium);
            ColumnFor(x => x.N, (66, 6), Convert.ToInt32);
            ColumnFor(x => x.Points, (72, 11), Convert.ToInt32);
        }
    }

    public class TeamStandingsColumnDef : ColumnDef<StandingResult>
    {
        public TeamStandingsColumnDef()
        {
            ColumnFor(x => x.Rank, (0, 6), CellValueParsers.ParseRank);
            ColumnFor(x => x.Name, (6, 29));
            ColumnFor(x => x.Nation, (35, 3));
            ColumnFor(x => x.I, (43, 6), CellValueParsers.ParsePodium);
            ColumnFor(x => x.II, (49, 6), CellValueParsers.ParsePodium);
            ColumnFor(x => x.III, (55, 6), CellValueParsers.ParsePodium);
            ColumnFor(x => x.N, (61, 6), Convert.ToInt32);
            ColumnFor(x => x.Points, (67, 11), Convert.ToInt32);
        }
    }

    public class TeamFinalResultColumnDef : ColumnDef<TeamFinalResult>
    {
        public TeamFinalResultColumnDef()
        {
            ColumnFor(x => x.Rank, (0, 6), CellValueParsers.ParseRank);
            ColumnFor(x => x.Bib, (6, 6), CellValueParsers.ParseBib);
            ColumnFor(x => x.Name, (12, 29));
            ColumnFor(x => x.Nation, (41, 3));
            ColumnFor(x => x.Points, (89, 8), CellValueParsers.ConvertToDecimalInvariantCulture);
        }
    }

    public class DSJ3FinalResultColumnDef : ColumnDef<FinalResult>
    {
        public DSJ3FinalResultColumnDef()
        {
            ColumnFor(x => x.Rank, (0, 6), CellValueParsers.ParseRank);
            ColumnFor(x => x.Name, (6, 25));
            ColumnFor(x => x.Nation, (31, 3));
            ColumnFor(x => x.Rating, (44, 4), Convert.ToInt32);
            ColumnFor(x => x.Length1, (48, 14), CellValueParsers.ParseLength);
            ColumnFor(x => x.Crashed1, (48, 14), CellValueParsers.IsCrash);
            ColumnFor(x => x.Length2, (62, 12), CellValueParsers.ParseLength);
            ColumnFor(x => x.Crashed2, (62, 12), CellValueParsers.IsCrash);
            ColumnFor(x => x.Points, (74, 11), CellValueParsers.ConvertToDecimalInvariantCulture);
        }
    }

    public class DSJ4FinalResultColumnDef : ColumnDef<FinalResult>
    {
        public DSJ4FinalResultColumnDef()
        {
            ColumnFor(x => x.Rank, (0, 6), CellValueParsers.ParseRank);
            ColumnFor(x => x.Bib, (6, 6), CellValueParsers.ParseBib);
            ColumnFor(x => x.LuckyLoser, (6, 6), CellValueParsers.IsLuckyLoser);
            ColumnFor(x => x.Name, (12, 25));
            ColumnFor(x => x.Nation, (37, 3));
            ColumnFor(x => x.Rating, (50, 4), Convert.ToInt32);
            ColumnFor(x => x.Length1, (54, 15), CellValueParsers.ParseLength);
            ColumnFor(x => x.Crashed1, (54, 15), CellValueParsers.IsCrash);
            ColumnFor(x => x.Length2, (69, 13), CellValueParsers.ParseLength);
            ColumnFor(x => x.Crashed2, (69, 13), CellValueParsers.IsCrash);
            ColumnFor(x => x.Points, (82, 11), CellValueParsers.ConvertToDecimalInvariantCulture);
        }
    }

    public class FinalResultTeamJumperColumnDef : ColumnDef<FinalResult>
    {
        public FinalResultTeamJumperColumnDef()
        {
            ColumnFor(x => x.Rank, (98, 7), CellValueParsers.ParseRank);
            ColumnFor(x => x.Bib, (6, 6), CellValueParsers.ParseBib);
            ColumnFor(x => x.LuckyLoser, (6, 6), CellValueParsers.IsLuckyLoser);
            ColumnFor(x => x.Name, (12, 29));
            ColumnFor(x => x.Nation, (41, 3));
            ColumnFor(x => x.Rating, (54, 4), Convert.ToInt32);
            ColumnFor(x => x.Length1, (60, 13), CellValueParsers.ParseLength);
            ColumnFor(x => x.Crashed1, (60, 13), CellValueParsers.IsCrash);
            ColumnFor(x => x.Length2, (73, 13), CellValueParsers.ParseLength);
            ColumnFor(x => x.Crashed2, (73, 13), CellValueParsers.IsCrash);
            ColumnFor(x => x.Points, (86, 12), CellValueParsers.ConvertToDecimalInvariantCulture);
        }
    }

    public class DSJ3QualificationResultColumnDef : ColumnDef<QualificationResult>
    {
        public DSJ3QualificationResultColumnDef()
        {
            ColumnFor(x => x.Rank, (0, 6), CellValueParsers.ParseRank);
            ColumnFor(x => x.Name, (6, 25));
            ColumnFor(x => x.Nation, (31, 3));
            ColumnFor(x => x.Rating, (44, 4), Convert.ToInt32);
            ColumnFor(x => x.Length, (48, 15), CellValueParsers.ParseLength);
            ColumnFor(x => x.Crashed, (48, 15), CellValueParsers.IsCrash);
            ColumnFor(x => x.Points, (63, 10), CellValueParsers.ConvertToDecimalInvariantCulture);
            ColumnFor(x => x.Qualified, (74, 11), CellValueParsers.IsQualified);
            ColumnFor(x => x.PreQualified, (74, 11), CellValueParsers.IsPrequalified);
        }
    }

    public class DSJ4QualificationResultColumnDef : ColumnDef<QualificationResult>
    {
        public DSJ4QualificationResultColumnDef()
        {
            ColumnFor(x => x.Rank, (0, 6), CellValueParsers.ParseRank);
            ColumnFor(x => x.Bib, (6, 6), CellValueParsers.ParseBib);
            ColumnFor(x => x.Name, (12, 25));
            ColumnFor(x => x.Nation, (37, 3));
            ColumnFor(x => x.Rating, (50, 4), Convert.ToInt32);
            ColumnFor(x => x.Length, (54, 15), CellValueParsers.ParseLength);
            ColumnFor(x => x.Crashed, (54, 15), CellValueParsers.IsCrash);
            ColumnFor(x => x.Points, (69, 11), CellValueParsers.ConvertToDecimalInvariantCulture);
            ColumnFor(x => x.Qualified, (82, 12), CellValueParsers.IsQualified);
            ColumnFor(x => x.PreQualified, (82, 12), CellValueParsers.IsPrequalified);
            ColumnFor(x => x.Team, (82, 12), CellValueParsers.ParseTeam);
        }
    }
}
