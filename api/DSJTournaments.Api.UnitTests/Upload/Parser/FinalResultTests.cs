using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using DSJTournaments.Api.Controllers.Upload.Services.Parser;
using DSJTournaments.Api.Controllers.Upload.Services.Parser.Model;
using Xunit;

namespace DSJTournaments.Upload.UnitTests.Upload.Parser
{
    [SuppressMessage("ReSharper", "PossibleNullReferenceException")]
    public class FinalResultTests
    {
        private readonly StatParser _parser;

        public FinalResultTests()
        {
            _parser = new StatParser();
        }

        [Theory]
        [InlineData("30.   Paweł Magdziak           POL          1307      242.50m     267.86m*      396.6", 30, "Paweł Magdziak", "POL", 1307, 242.5, false, 267.86, true, 396.6)]
        [InlineData("42.   Krzysztof Stuchlik       POL          1452            -           -         0.0", 42, "Krzysztof Stuchlik", "POL", 1452, null, false, null, false, 0.0)]
        [InlineData("      Pawel Magdziak           POL          1426      238.55m                   192.5", null, "Pawel Magdziak", "POL", 1426, 238.55, false, null, false, 192.5)]
        public async Task HandlesDSJ3FinalResults(string result, int? rank, string name, string nation,
            int rating, double? length1, bool crashed1, double? length2, bool crashed2, double points)
        {
            var stats = await _parser.Parse(new[] {result}.AsFinalResults(3).Build()) as FinalResultStats;

            Assert.Equal(rank, stats.Results[0].Rank);
            Assert.Equal(name, stats.Results[0].Name);
            Assert.Equal(nation, stats.Results[0].Nation);
            Assert.Equal(rating, stats.Results[0].Rating);
            Assert.Equal((decimal?) length1, stats.Results[0].Length1);
            Assert.Equal(crashed1, stats.Results[0].Crashed1);
            Assert.Equal((decimal?) length2, stats.Results[0].Length2);
            Assert.Equal(crashed2, stats.Results[0].Crashed2);
            Assert.Equal((decimal) points, stats.Results[0].Points);
        }

        [Theory]
        [InlineData("24.   30    Dariusz Sidor            POL          1402     211.95 m     207.14 m*       391.2", 24, 30, false, "Dariusz Sidor", "POL", 1402, 211.95, false, 207.14, true, 391.2)]
        [InlineData("28.   27*   Odd Arne Ravnå           NOR          1092     134.85 m     131.25 m        277.4", 28, 27, true, "Odd Arne Ravnå", "NOR", 1092, 134.85, false, 131.25, false, 277.4)]
        [InlineData("29.   7     Dominik Hager            GER          1189     208.31 m**   201.52 m        382.4", 29, 7, false, "Dominik Hager", "GER", 1189, 208.31, true, 201.52, false, 382.4)]
        public async Task HandlesDSJ4FinalResults(string result, int? rank, int? bib, bool luckyLoser, string name, string nation,
            int rating, double? length1, bool crashed1, double? length2, bool crashed2, double points)
        {
            var stats = await _parser.Parse(new[] { result }.AsFinalResults(4).Build()) as FinalResultStats;

            Assert.Equal(rank, stats.Results[0].Rank);
            Assert.Equal(bib, stats.Results[0].Bib);
            Assert.Equal(luckyLoser, stats.Results[0].LuckyLoser);
            Assert.Equal(name, stats.Results[0].Name);
            Assert.Equal(nation, stats.Results[0].Nation);
            Assert.Equal(rating, stats.Results[0].Rating);
            Assert.Equal((decimal?) length1, stats.Results[0].Length1);
            Assert.Equal(crashed1, stats.Results[0].Crashed1);
            Assert.Equal((decimal?) length2, stats.Results[0].Length2);
            Assert.Equal(crashed2, stats.Results[0].Crashed2);
            Assert.Equal((decimal) points, stats.Results[0].Points);
        }

        [Fact]
        public async Task HandlesTeamFinalResults()
        {
            var contents = new[]
            {
                "5.    12    Mieszane drużyny  II         MIX                                               1014.8",
                "      12-1  Mateusz Sobon                IRL          1660      131.0 m      129.0 m        274.0    (1.)",
                "      12-2  Przemysław Strzelczyk        POL          1055      127.5 m      128.5 m        260.8   (20.)",
                "      12-3  Želimir Božič                SLO           940      128.5 m      120.0 m        247.3   (25.)",
                "      12-4  Zoma Telemark                AUT           875      119.0 m      125.0 m        232.7   (30.)"
            }.AsTeamFinalResults().Build();

            var stats = await _parser.Parse(contents) as TeamFinalResultStats;

            Assert.Equal(5, stats.Results[0].Rank);
            Assert.Equal(12, stats.Results[0].Bib);
            Assert.Equal("Mieszane drużyny  II", stats.Results[0].Name);
            Assert.Equal("MIX", stats.Results[0].Nation);
            Assert.Equal(1014.8m, stats.Results[0].Points);

            Assert.Collection(stats.Results[0].Jumpers,
                fr =>
                {
                    Assert.Equal(1, fr.Rank);
                    Assert.Equal(1, fr.Bib);
                    Assert.False(fr.LuckyLoser);
                    Assert.Equal("Mateusz Sobon", fr.Name);
                    Assert.Equal("IRL", fr.Nation);
                    Assert.Equal(1660, fr.Rating);
                    Assert.Equal(131.0m, fr.Length1);
                    Assert.False(fr.Crashed1);
                    Assert.Equal(129.0m, fr.Length2);
                    Assert.False(fr.Crashed2);
                    Assert.Equal(274.0m, fr.Points);
                },
                fr =>
                {
                    Assert.Equal(20, fr.Rank);
                    Assert.Equal(2, fr.Bib);
                    Assert.False(fr.LuckyLoser);
                    Assert.Equal("Przemysław Strzelczyk", fr.Name);
                    Assert.Equal("POL", fr.Nation);
                    Assert.Equal(1055, fr.Rating);
                    Assert.Equal(127.5m, fr.Length1);
                    Assert.False(fr.Crashed1);
                    Assert.Equal(128.5m, fr.Length2);
                    Assert.False(fr.Crashed2);
                    Assert.Equal(260.8m, fr.Points);
                },
                fr =>
                {
                    Assert.Equal(25, fr.Rank);
                    Assert.Equal(3, fr.Bib);
                    Assert.False(fr.LuckyLoser);
                    Assert.Equal("Želimir Božič", fr.Name);
                    Assert.Equal("SLO", fr.Nation);
                    Assert.Equal(940, fr.Rating);
                    Assert.Equal(128.5m, fr.Length1);
                    Assert.False(fr.Crashed1);
                    Assert.Equal(120.0m, fr.Length2);
                    Assert.False(fr.Crashed2);
                    Assert.Equal(247.3m, fr.Points);
                },
                fr =>
                {
                    Assert.Equal(30, fr.Rank);
                    Assert.Equal(4, fr.Bib);
                    Assert.False(fr.LuckyLoser);
                    Assert.Equal("Zoma Telemark", fr.Name);
                    Assert.Equal("AUT", fr.Nation);
                    Assert.Equal(875, fr.Rating);
                    Assert.Equal(119.0m, fr.Length1);
                    Assert.False(fr.Crashed1);
                    Assert.Equal(125.0m, fr.Length2);
                    Assert.False(fr.Crashed2);
                    Assert.Equal(232.7m, fr.Points);
                });
        }
    }
}
