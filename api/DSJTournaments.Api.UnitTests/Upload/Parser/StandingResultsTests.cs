using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using DSJTournaments.Api.Controllers.Upload.Services.Parser;
using DSJTournaments.Api.Controllers.Upload.Services.Parser.Model;
using Xunit;

namespace DSJTournaments.Upload.UnitTests.Upload.Parser
{
    [SuppressMessage("ReSharper", "PossibleNullReferenceException")]
    public class StandingResultsTests
    {
        private readonly StatParser _parser;

        public StandingResultsTests()
        {
            _parser = new StatParser();
        }

        [Theory]
        [InlineData("31.   Petri Tuominen           FIN          1317     -    10     5    54        385",
            31, "Petri Tuominen", "FIN", 1317, 0, 10, 5, 54, 385.0)]
        public async Task HandlesFinalStandingResults(string resultRow, params object[] expects)
        {
            var stats = await _parser.Parse(new[] {resultRow}.AsFinalStandings().Build()) as StandingStats;

            Assert.Equal(expects[0], stats.Results[0].Rank);
            Assert.Equal(expects[1], stats.Results[0].Name);
            Assert.Equal(expects[2], stats.Results[0].Nation);
            Assert.Equal(expects[3], stats.Results[0].Rating);
            Assert.Equal(expects[4], stats.Results[0].I);
            Assert.Equal(expects[5], stats.Results[0].II);
            Assert.Equal(expects[6], stats.Results[0].III);
            Assert.Equal(expects[7], stats.Results[0].N);
            Assert.Equal(expects[8], Convert.ToDouble(stats.Results[0].Points));
        }

        [Theory]
        [InlineData("1.    Poland I                     POL         15     4     -    21       7900",
            1, "Poland I", "POL", null, 15, 4, 0, 21, 7900.0)]
        public async Task HandlesFinalStandingTeamResults(string resultRow, params object[] expects)
        {
            var stats = await _parser.Parse(new[] { resultRow }.AsTeamFinalStandings().Build()) as StandingStats;

            Assert.Equal(expects[0], stats.Results[0].Rank);
            Assert.Equal(expects[1], stats.Results[0].Name);
            Assert.Equal(expects[2], stats.Results[0].Nation);
            Assert.Equal(expects[3], stats.Results[0].Rating);
            Assert.Equal(expects[4], stats.Results[0].I);
            Assert.Equal(expects[5], stats.Results[0].II);
            Assert.Equal(expects[6], stats.Results[0].III);
            Assert.Equal(expects[7], stats.Results[0].N);
            Assert.Equal(expects[8], Convert.ToDouble(stats.Results[0].Points));
        }
    }
}
