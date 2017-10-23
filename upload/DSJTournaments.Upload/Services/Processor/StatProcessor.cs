using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using DSJTournaments.Data;
using DSJTournaments.Data.Schema;
using DSJTournaments.Upload.Services.Parser.Model;
using FinalResult = DSJTournaments.Data.Schema.FinalResult;
using QualificationResult = DSJTournaments.Data.Schema.QualificationResult;
using TeamFinalResult = DSJTournaments.Data.Schema.TeamFinalResult;

namespace DSJTournaments.Upload.Services.Processor
{
    public class StatProcessor
    {
        private readonly Database _db;

        private readonly Dictionary<string, Jumper> _jumperCache;

        private readonly Dictionary<(string, int), TournamentType> _tournamentTypeCache;

        public StatProcessor(Database db)
        {
            _db = db;
            _jumperCache = db.Query<Jumper>().All().ToDictionary(j => j.Name);
            _tournamentTypeCache = db.Query<TournamentType>().All().ToDictionary(tt => (tt.Name, tt.GameVersion));
        }

        public void ClearCache()
        {
            _jumperCache.Clear();
            _tournamentTypeCache.Clear();
        }

        public async Task Process(Stats stats, int fileNumber)
        {
            var tournament = await GetOrCreateTournament(stats);
         
            switch (stats)
            {
                case StandingStats results:
                    await ProcessFinalStandings(tournament, results);
                    break;
                    
                case TeamFinalResultStats results:
                    await ProcessTeamFinalResults(tournament, fileNumber, results);
                    break;
                    
                case FinalResultStats results:
                    await ProcessFinalResults(tournament, fileNumber, results);
                    break;
                    
                case QualificationStats results:
                    await ProcessQualificationResults(tournament, fileNumber, results);
                    break;
            }
        }

        private async Task ProcessFinalStandings(Tournament tournament, StandingStats stats)
        {
            if (stats.CompletedHills != stats.TotalHills)
            {
                throw new StatProcessorException("Intermediary standings not supported");
            }
            
            if (await TournamentHasFinalStandings(tournament))
            {
                throw new StatProcessorException("Final standings for this tournament already exist");
            }

            if (tournament.HillCount == null)
            {
                await _db.Update(tournament, t => t.HillCount = stats.TotalHills);
            }

            var isTeamCup = stats.Type == "Team Cup";

            int previousRank = 1;
            foreach (var standing in stats.Results)
            {
                var rank = standing.Rank ?? previousRank;
                await _db.Insert(new FinalStanding
                {
                    Rank = rank,
                    Rating = isTeamCup
                        ? (int?) null
                        : standing.Rating ?? throw new StatProcessorException($"Missing rating for {standing.Name}"),
                    I = standing.I,
                    II = standing.II,
                    III = standing.III,
                    N = standing.N,
                    Points = standing.Points,
                    CupPoints = CalculateCupPoints(rank),
                    JumperId = isTeamCup ? (int?) null : (await GetOrCreateJumper(standing.Name, standing.Nation)).Id,
                    TeamId = isTeamCup ? (await GetOrCreateTeam(standing.Name, standing.Nation)).Id : (int?) null,
                    TournamentId = tournament.Id
                });
                
                if (standing.Rank.HasValue)
                {
                    previousRank = standing.Rank.Value;
                }
            }
        }

        private async Task ProcessQualificationResults(Tournament tournament, int fileNumber, QualificationStats stats)
        {
            var comp = await GetOrCreateCompetition(tournament, fileNumber, stats.Hill, stats.GameVersion, stats.Knockout);
            if (await CompetitionHasQualificationResults(comp))
            {
                throw new StatProcessorException("Qualification results for this hill already exist");
            }

            int previousRank = 1;
            foreach (var qualResult in stats.Results)
            {
                await _db.Insert(new QualificationResult
                {
                    Bib = qualResult.Bib,
                    Rank = qualResult.Rank ?? previousRank,
                    Rating = qualResult.Rating,
                    Length = qualResult.Length,
                    Crashed = qualResult.Crashed,
                    Points = qualResult.Points,
                    Prequalified = qualResult.PreQualified,
                    Qualified = qualResult.Qualified,
                    JumperId = (await GetOrCreateJumper(qualResult.Name, qualResult.Nation)).Id,
                    TeamId = qualResult.Team != null ? (await GetOrCreateTeam(qualResult.Team)).Id : (int?)null,
                    CompetitionId = comp.Id
                });

                if (qualResult.Rank.HasValue)
                {
                    previousRank = qualResult.Rank.Value;
                }
            }
        }

        private async Task ProcessFinalResults(Tournament tournament, int fileNumber, FinalResultStats stats)
        {
            var comp = await GetOrCreateCompetition(tournament, fileNumber, stats.Hill, stats.GameVersion, stats.Knockout);
            if (await CompetitionHasFinalResults(comp))
            {
                throw new StatProcessorException("Final results for this hill already exist");
            }

            await InsertFinalResults(comp, stats.Results);
        }

        private async Task InsertFinalResults(Competition comp, Parser.Model.FinalResult[] results, int? teamResultId = null)
        {
            int previousRank = 1;
            foreach (var finalResult in results)
            {
                await _db.Insert(new FinalResult
                {
                    Bib = finalResult.Bib,
                    Rank = finalResult.Rank ?? previousRank,
                    Rating = finalResult.Rating,
                    Length1 = finalResult.Length1,
                    Crashed1 = finalResult.Crashed1,
                    Length2 = finalResult.Length2,
                    Crashed2 = finalResult.Crashed2,
                    LuckyLoser = finalResult.LuckyLoser,
                    Points = finalResult.Points,
                    CompetitionId = comp.Id,
                    JumperId = (await GetOrCreateJumper(finalResult.Name, finalResult.Nation)).Id,
                    TeamResultId = teamResultId
                });

                if (finalResult.Rank.HasValue)
                {
                    previousRank = finalResult.Rank.Value;
                }
            }
        }

        private async Task ProcessTeamFinalResults(Tournament tournament, int fileNumber, TeamFinalResultStats stats)
        {
            var comp = await GetOrCreateCompetition(tournament, fileNumber, stats.Hill, stats.GameVersion, false);
            if (await CompetitionHasTeamFinalResults(comp))
            {
                throw new StatProcessorException("Team final results for this hill already exist");
            }

            int previousRank = 1;
            foreach (var result in stats.Results)
            {
                var teamResult = await _db.Insert(new TeamFinalResult
                {
                    Rank = result.Rank ?? previousRank,
                    Bib = result.Bib,
                    Points = result.Points,
                    CompetitionId = comp.Id,
                    TeamId = (await GetOrCreateTeam(result.Name, result.Nation)).Id
                });

                await InsertFinalResults(comp, result.Jumpers, teamResult.Id);

                if (result.Rank.HasValue)
                {
                    previousRank = result.Rank.Value;
                }
            }
        }

        private async Task<Team> GetOrCreateTeam(string name, string nation)
        {
            var rank = Regex.Match(name, @"(?<rank>[IVX]+)").Groups["rank"].Value;
            return await GetOrCreateTeam($"{nation} {rank}");
        }

        private async Task<Team> GetOrCreateTeam(string shortName)
        {
            var nationAndRank = shortName.Split(' ');
            var team = await _db.Query<Team>()
                .Where("nation = @Nation AND rank = @Rank", new
                {
                    Nation = nationAndRank[0], 
                    Rank = nationAndRank[1]
                })
                .FirstOrDefaultAsync();

            return team ?? await _db.Insert(new Team
            {
                Nation = nationAndRank[0],
                Rank = nationAndRank[1]
            });
        }

        private async Task<Jumper> GetOrCreateJumper(string name, string nation)
        {
            var jumper = await GetJumper(name);
            if (jumper == null)
            {
                return await _db.Insert(new Jumper
                {
                    Name = name,
                    Nation = nation
                });
            }
            else if (jumper.Nation != nation)
            {
                await _db.Update(jumper, j => j.Nation = nation);
            }
            
            return jumper;
        }

        private async Task<Jumper> GetJumper(string name)
        {
            if (_jumperCache.TryGetValue(name, out Jumper jumper))
            {
                return jumper;
            }

            jumper = await _db.Query<Jumper>()
                .Where("name = @Name", new {Name = name})
                .FirstOrDefaultAsync();

            if (jumper != null)
            {
                _jumperCache.Add(jumper.Name, jumper);
            }

            return jumper;
        }

        private async Task<bool> TournamentHasFinalStandings(Tournament tournament)
        {
            return await _db.Query<FinalStanding>()
                .Where("tournament_id = @TournamentId", new { TournamentId = tournament.Id})
                .ExistsAsync();
        }
        
        private async Task<bool> CompetitionHasQualificationResults(Competition comp)
        {
            return await _db.Query<QualificationResult>()
                .Where("competition_id = @CompetitionId", new { CompetitionId = comp.Id})
                .ExistsAsync();
        }

        private async Task<bool> CompetitionHasFinalResults(Competition comp)
        {
            return await _db.Query<FinalResult>()
                .Where("competition_id = @CompetitionId", new { CompetitionId = comp.Id})
                .ExistsAsync();
        }

        private async Task<bool> CompetitionHasTeamFinalResults(Competition comp)
        {
            return await _db.Query<TeamFinalResult>()
                .Where("competition_id = @CompetitionId", new { CompetitionId = comp.Id})
                .ExistsAsync();
        }

        private async Task<Tournament> GetOrCreateTournament(Stats stats)
        {
            var tournamentType = await GetTournamentType(stats);
            return await GetTournament(stats, tournamentType) ??
                   await CreateTournament(stats, tournamentType);
        }

        private async Task<Competition> GetOrCreateCompetition(Tournament tournament, int fileNumber, string hillName,
            int gameVersion, bool ko)
        {
            var hill = await GetHill(hillName, gameVersion);
            return await GetCompetition(tournament, fileNumber, hill) ??
                   await CreateCompetition(tournament, fileNumber, hill, ko);
        }

        private async Task<Competition> CreateCompetition(Tournament tournament, int fileNumber, Hill hill, bool knockout)
        {
            return await _db.Insert(new Competition
            {
                TournamentId = tournament.Id,
                FileNumber = fileNumber,
                HillId = hill.Id,
                KO = knockout
            });
        }

        private async Task<Competition> GetCompetition(Tournament tournament, int fileNumber, Hill hill)
        {
            return await _db.Query<Competition>()
                .Where("tournament_id = @TournamentId", new {TournamentId = tournament.Id})
                .Where("hill_id = @HillId", new {HillId = hill.Id})
                .Where("file_number = @FileNumber", new {FileNumber = fileNumber})
                .FirstOrDefaultAsync();
        }

        private async Task<Hill> GetHill(string name, int gameVersion)
        {
            Hill hill = null;
            if (gameVersion == 3)
            {
                var hillSize = Regex.Match(name, @"\d{2,3}")?.Value;
                if (!string.IsNullOrWhiteSpace(hillSize))
                {
                    hill = await _db.Query<Hill>()
                        .Where("game_version = 3")
                        .Where("name like @Name", new {Name = "%HS" + hillSize})
                        .FirstOrDefaultAsync();
                }
            }
            else
            {
                hill = await _db.Query<Hill>()
                    .Where("name = @Name", new {Name = name})
                    .FirstOrDefaultAsync();
            }

            if (hill == null)
            {
                throw new StatProcessorException($"The hill \"{name}\" is unknown for DSJ{gameVersion}");
            }

            return hill;
        }

        private async Task<TournamentType> GetTournamentType(Stats stats)
        {
            if (_tournamentTypeCache.TryGetValue((stats.Type, stats.GameVersion), out TournamentType tournamentType))
            {
                return tournamentType;
            }

            tournamentType = await _db.Query<TournamentType>()
                .Where("name = @Name", new {Name = stats.Type})
                .Where("game_version = @GameVersion", new { GameVersion = stats.GameVersion})
                .FirstOrDefaultAsync();

            if (tournamentType == null)
            {
                throw new StatProcessorException($"The tournament type \"{stats.Type}\" is unknown");
            }

            _tournamentTypeCache.Add((tournamentType.Name, tournamentType.GameVersion), tournamentType);
            return tournamentType;
        }

        private async Task<Tournament> GetTournament(Stats stats, TournamentType tournamentType)
        {
            return await _db.Query<Tournament>()
                .Filter("date = @Date", new {Date = stats.Date})
                .Filter("tournament_type_id = @TournamentTypeId", new {TournamentTypeId = tournamentType.Id})
                .FirstOrDefaultAsync();
        }

        private async Task<Tournament> CreateTournament(Stats stats, TournamentType tournamentType)
        {
            var tournament = await _db.Insert(new Tournament
            {
                Date = stats.Date,
                GameVersion = stats.GameVersion,
                TournamentTypeId = tournamentType.Id,
                HillCount = stats is StandingStats s ? s.TotalHills : (int?) null
            });
            
            // Connect to cups
            await _db.ExecuteAsync(@"
                UPDATE 
                    cup_dates 
                SET 
                    tournament_id = @TournamentId
                WHERE 
                    date = @Date AND 
                    (SELECT COALESCE(game_version, @GameVersion) FROM cups c WHERE c.id = cup_id) = @GameVersion",
                new
                {
                    Date = tournament.Date, 
                    GameVersion = tournament.GameVersion, 
                    TournamentId = tournament.Id
                });

            return tournament;
        }

        private static readonly Dictionary<int, int> CupPoints = new Dictionary<int, int>
        {
            {1, 100},
            {2, 80},
            {3, 60},
            {4, 50},
            {5, 45},
            {6, 40},
            {7, 36},
            {8, 32},
            {9, 29},
            {10, 26},
            {11, 24},
            {12, 22},
            {13, 20},
            {14, 18},
            {15, 16},
            {16, 15},
            {17, 14},
            {18, 13},
            {19, 12},
            {20, 11},
            {21, 10},
            {22, 9},
            {23, 8},
            {24, 7},
            {25, 6},
            {26, 5},
            {27, 4},
            {28, 3},
            {29, 2},
            {30, 1}
        };

        private int CalculateCupPoints(int rank)
        {
            return CupPoints.ContainsKey(rank)
                ? CupPoints[rank]
                : 0;
        }
    }
}