using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using DSJTournaments.Api.Controllers.Upload.Services.Parser;
using DSJTournaments.Api.Controllers.Upload.Services.Parser.Model;
using Xunit;

namespace DSJTournaments.Api.UnitTests.Upload.Parser
{
    [SuppressMessage("ReSharper", "PossibleNullReferenceException")]
    public class QualResultTests
    {
        private readonly StatParser _parser;

        public QualResultTests()
        {
            _parser = new StatParser();
        }

        [Theory]
        [InlineData("6.    Łukasz Krzemiński        POL          1103      211.54m*      183.8           Q", 6, "Łukasz Krzemiński", "POL", 1103, 211.54, true, 183.8, true, true)]
        public async Task HandlesDSJ3QualResults(string result, int? rank, string name, string nation,
            int rating, double? length, bool crashed, double points, bool qualified, bool preQualified)
        {
            var stats = await _parser.Parse(new[] { result }.AsQualResults(3).Build()) as QualificationStats;

            Assert.Equal(rank, stats.Results[0].Rank);
            Assert.Equal(name, stats.Results[0].Name);
            Assert.Equal(nation, stats.Results[0].Nation);
            Assert.Equal(rating, stats.Results[0].Rating);
            Assert.Equal((decimal?) length, stats.Results[0].Length);
            Assert.Equal(crashed, stats.Results[0].Crashed);
            Assert.Equal((decimal) points, stats.Results[0].Points);
            Assert.Equal(qualified, stats.Results[0].Qualified);
            Assert.Equal(preQualified, stats.Results[0].PreQualified);
        }

        [Theory]
        [InlineData("17.   18    Jani Novak               SLO          1272     135.73 m        137.9           q", 17, 18, "Jani Novak", "SLO", 1272, 135.73, false, 137.9, true, false, null)]
        [InlineData("12.   26    Michał Nowosiad          POL          1037     122.54 m        122.5       POL II", 12, 26, "Michał Nowosiad", "POL", 1037, 122.54, false, 122.5, true, false, "POL II")]
        public async Task HandlesDSJ4QualResults(string result, int? rank, int bib, string name, string nation,
            int rating, double? length, bool crashed, double points, bool qualified, bool preQualified, string team)
        {
            var stats = await _parser.Parse(new[] { result }.AsQualResults(4).Build()) as QualificationStats;

            Assert.Equal(rank, stats.Results[0].Rank);
            Assert.Equal(bib, stats.Results[0].Bib);
            Assert.Equal(name, stats.Results[0].Name);
            Assert.Equal(nation, stats.Results[0].Nation);
            Assert.Equal(rating, stats.Results[0].Rating);
            Assert.Equal((decimal?) length, stats.Results[0].Length);
            Assert.Equal(crashed, stats.Results[0].Crashed);
            Assert.Equal((decimal) points, stats.Results[0].Points);
            Assert.Equal(qualified, stats.Results[0].Qualified);
            Assert.Equal(preQualified, stats.Results[0].PreQualified);
            Assert.Equal(team, stats.Results[0].Team);
        }
    }
}
