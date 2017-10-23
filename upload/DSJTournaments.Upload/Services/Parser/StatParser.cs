using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using DSJTournaments.Upload.Services.Parser.ColumnDefs;
using DSJTournaments.Upload.Services.Parser.Model;

namespace DSJTournaments.Upload.Services.Parser
{
    public class StatParser
    {
        private static string StandingRegex = 
            @"(?<completed_hills>\d{1,3})\/(?<total_hills>\d{1,3})";
        private static string FinalResultRegex =
            @"(?<hill>.+HS\d{2,3}) (Competition Final Results|Kilpailun lopputulokset|Wettkampf Endergebnisse|Konkurranse Endelig Resultatliste|Wyniki konkursu|Končni rezultati tekmovanja)";
        private static string QualRegex =
            @"(?<hill>.+HS\d{2,3}) (Qualification Results|Karsinnan tulokset|Qualifikation Ergebnisse|Kvalifisering Resultater|Wyniki kwalifikacji|Rezultati kvalifikacij)";

        public async Task<Stats> Parse(string contents)
        {
            using (var reader = new StringReader(contents))
                return await Parse(reader);
        }

        public async Task<Stats> Parse(TextReader reader)
        {
            var header1 = await reader.ReadLineAsync();
            var header2 = await reader.ReadLineAsync();

            Stats stats = ParseHeaders(header1, header2);

            await reader.ReadLineAsync();
            await reader.ReadLineAsync();

            ParseResults(stats,
                (await reader.ReadToEndAsync()).Split(new[] {"\r\n", "\r", "\n"},
                    StringSplitOptions.RemoveEmptyEntries));
            
            return stats;
        }

        private void ParseResults(Stats stats, string[] results)
        {
            switch (stats)
            {
                case StandingStats s when s.Type == "Team Cup":
                    s.Results = ParseResultsInner(results, new TeamStandingsColumnDef());
                    break;

                case StandingStats s:
                    s.Results = ParseResultsInner(results, new StandingsColumnDef());
                    break;

                case TeamFinalResultStats s:
                    s.Results = ParseResultsInner(results.Where(r => r.Length == 97).ToArray(), new TeamFinalResultColumnDef());
                    int skip = 0;
                    foreach (var teamFinalResult in s.Results)
                    {
                        var jumperResults = results.Skip(++skip).TakeWhile(r => r.Length != 97).ToArray();
                        teamFinalResult.Jumpers =
                            ParseResultsInner(jumperResults, new FinalResultTeamJumperColumnDef());

                        skip += jumperResults.Length;
                    }
                    
                    break;

                case FinalResultStats s when s.GameVersion == 3:
                    s.Results = ParseResultsInner(results, new DSJ3FinalResultColumnDef());
                    break;

                case FinalResultStats s when s.GameVersion == 4:
                    s.Results = ParseResultsInner(results, new DSJ4FinalResultColumnDef());
                    break;

                case QualificationStats s when s.GameVersion == 3:
                    s.Results = ParseResultsInner(results, new DSJ3QualificationResultColumnDef());
                    break;

                case QualificationStats s when s.GameVersion == 4:
                    s.Results = ParseResultsInner(results, new DSJ4QualificationResultColumnDef());
                    break;

                default:
                    throw new StatParserException("Unrecognized stats");
            }
        }

        private TResult[] ParseResultsInner<TResult>(string[] results, ColumnDef<TResult> columnDef) where TResult : new()
        {
            var resultElements = new List<TResult>();

            foreach (var result in results)
            {
                var resultElement = new TResult();
                foreach (var (prop, (offset, length), transform) in columnDef.Columns)
                {
                    var substringStartIndex = offset < result.Length
                        ? offset
                        : result.Length;

                    var substringLength = substringStartIndex + length <= result.Length
                        ? length
                        : result.Length - substringStartIndex;

                    var slice = result.Substring(substringStartIndex, substringLength).Trim();

                    try
                    {
                        var value = transform(slice);
                        prop.SetValue(resultElement, value);
                    }
                    catch (Exception e)
                    {
                        throw new StatParserException(
                            $"Failed to set value of property \"{prop.Name}\" from slice \"{slice}\" at offset {offset}", e);
                    }
                }

                resultElements.Add(resultElement);
            }

            return resultElements.ToArray();
        }

        private Stats ParseHeaders(string header1, string header2)
        {
            var stats = ParseHeader1(header1);
            stats = ParseHeader2(stats, header2);
            
            return stats;
        }

        private Stats ParseHeader1(string header1)
        {
            var stats = new Stats();

            // WTB pattern matching
            var elems = header1.Split(' ');
            
            if (elems.Length == 6 && elems[0] == "WC" && elems[1] == "-")
            {
                // DSJ3 (1.7) World Cup
                stats.Type = "World Cup";
                stats.GameVersion = 3;
                stats.Date = ParseDate(elems[5], elems[3]);
            }
            else if (elems.Length == 7 && elems[0] == "WCx3")
            {
                // DSJ3 (1.7) Marathon
                stats.Type = "Marathon";
                stats.GameVersion = 3;
                stats.Date = ParseDate(elems[6], elems[4]);
            }
            else if (elems.Length == 7 && elems[0] == "WC")
            {
                // DSJ4 (1.6) World Cup A / World Cup B
                stats.Type = "World Cup " + elems[2];
                stats.GameVersion = 4;
                stats.Date = ParseDate(elems[6], elems[4]);
            }
            else if (elems.Length == 8 && elems[0] == "Marathon")
            {
                // DSJ4 (1.6) Marathon A / Marathon B
                stats.Type = "Marathon " + elems[1];
                stats.GameVersion = 4;
                stats.Date = ParseDate(elems[7], elems[5]);
            }
            else if (elems.Length == 9 && elems[0] == "Ski")
            {
                // DSJ4 (1.6) Ski Flying A / Ski Flying B
                stats.Type = "Ski Flying " + elems[2];
                stats.GameVersion = 4;
                stats.Date = ParseDate(elems[8], elems[6]);
            }
            else if (elems.Length == 7 && elems[0] == "Team")
            {
                // DSJ4 (1.6) Team Cup
                stats.Type = "Team Cup";
                stats.GameVersion = 4;
                stats.Date = ParseDate(elems[6], elems[4]);
            }
            else if (elems.Length == 10 && elems[0] == "Tour")
            {
                // DSJ4 (1.6) Tour de DSJ
                stats.Type = "Tour de DSJ " + elems[3];
                stats.GameVersion = 4;
                stats.Date = ParseDate(elems[9], elems[7]);
            }
            else
            {
                throw new StatParserException("Can't determine the type of tournament");
            }

            return stats;
        }

        private Stats ParseHeader2(Stats tempStats, string header2)
        {
            Stats stats;
            Match match;
            if ((match = Regex.Match(header2, StandingRegex)).Success)
            {
                stats = new StandingStats
                {
                    CompletedHills = Convert.ToInt32(match.Groups["completed_hills"].Value),
                    TotalHills = Convert.ToInt32(match.Groups["total_hills"].Value)
                };
            }
            else if ((match = Regex.Match(header2, FinalResultRegex)).Success)
            {
                if (tempStats.Type == "Team Cup")
                {
                    stats = new TeamFinalResultStats
                    {
                        Hill = match.Groups["hill"].Value
                    };
                }
                else
                {
                    stats = new FinalResultStats
                    {
                        Hill = match.Groups["hill"].Value,
                        Knockout = header2.Contains("KO")
                    };
                }
            }
            else if ((match = Regex.Match(header2, QualRegex)).Success)
            {
                stats = new QualificationStats
                {
                    Hill = match.Groups["hill"].Value,
                    Knockout = header2.Contains("KO")
                };
            }
            else
            {
                throw new StatParserException("Can't determine the type of stats");
            }

            stats.Type = tempStats.Type;
            stats.Date = tempStats.Date;
            stats.GameVersion = tempStats.GameVersion;

            return stats;
        }

        private DateTime ParseDate(string date, string time)
        {
            return DateTime.Parse(date + " " + time.Replace('.', ':'), CultureInfo.InvariantCulture);
        }
    }
}
