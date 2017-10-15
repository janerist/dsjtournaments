using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using DSJTournaments.Api.Resources.Upload.Services.Parser;
using DSJTournaments.Api.Resources.Upload.Services.Parser.Model;
using Xunit;

namespace DSJTournaments.Api.UnitTests.Upload.Parser
{
    [SuppressMessage("ReSharper", "PossibleNullReferenceException")]
    public class Header2Tests
    {
        private readonly StatParser _parser;

        public Header2Tests()
        {
            _parser = new StatParser();
        }

        [Fact]
        public async Task ThrowsGivenInvalidHeader2()
        {
            var ex = await Assert.ThrowsAsync<StatParserException>(() => _parser.Parse("Invalid header2".AsHeader2().Build()));
            Assert.Equal("Can't determine the type of stats", ex.Message);
        }

        [Theory]
        [InlineData("Standings After 6/40 Hills", 6, 40)]
        [InlineData("Final Results After 40/40 Hills", 40, 40)]
        [InlineData("Lopputulokset 1/1 mäen jälkeen", 1, 1)]
        [InlineData("Endergebnis nach 1/1 Schanzen", 1, 1)]
        [InlineData("Resultater Etter 1/1 Renn", 1, 1)]
        [InlineData("Klasyfikacja końcowa po 1/1 konkursach", 1, 1)]
        [InlineData("Končni rezultati po 1/1 skakalnicah", 1, 1)]
        public async Task HandlesStandings(string header2, int expectedCompletedHills, int expectedTotalHills)
        {
            var stats = await _parser.Parse(header2.AsHeader2().Build()) as StandingStats;
            Assert.Equal(expectedCompletedHills, stats.CompletedHills);
            Assert.Equal(expectedTotalHills, stats.TotalHills);
        }

        [Theory]
        [InlineData("Romania HS228 Competition Final Results", "Romania HS228", false)]
        [InlineData("Romania HS228 Competition Final Results (KO)", "Romania HS228", true)]
        [InlineData("Romania HS228 Kilpailun lopputulokset", "Romania HS228", false)]
        [InlineData("Romania HS228 Wettkampf Endergebnisse", "Romania HS228", false)]
        [InlineData("Romania HS228 Konkurranse Endelig Resultatliste", "Romania HS228", false)]
        [InlineData("Romania HS228 Wyniki konkursu", "Romania HS228", false)]
        [InlineData("Romania HS228 Končni rezultati tekmovanja", "Romania HS228", false)]
        public async Task HandlesFinalResults(string header2, string expectedHill, bool expectedKnockout)
        {
            var stats = await _parser.Parse(header2.AsHeader2().Build()) as FinalResultStats;
            Assert.Equal(expectedHill, stats.Hill);
            Assert.Equal(expectedKnockout, stats.Knockout);
        }

        [Theory]
        [InlineData("Croatia HS278 Qualification Results", "Croatia HS278", false)]
        [InlineData("Croatia HS278 Qualification Results (KO)", "Croatia HS278", true)]
        [InlineData("Croatia HS278 Karsinnan tulokset", "Croatia HS278", false)]
        [InlineData("Croatia HS278 Qualifikation Ergebnisse", "Croatia HS278", false)]
        [InlineData("Croatia HS278 Kvalifisering Resultater", "Croatia HS278", false)]
        [InlineData("Croatia HS278 Wyniki kwalifikacji", "Croatia HS278", false)]
        [InlineData("Croatia HS278 Rezultati kvalifikacij", "Croatia HS278", false)]
        public async Task HandlesQualificationResults(string header2, string expectedHill, bool expectedKnockout)
        {
            var stats = await _parser.Parse(header2.AsHeader2().Build()) as QualificationStats;
            Assert.Equal(expectedHill, stats.Hill);
            Assert.Equal(expectedKnockout, stats.Knockout);
        }
    }
}
