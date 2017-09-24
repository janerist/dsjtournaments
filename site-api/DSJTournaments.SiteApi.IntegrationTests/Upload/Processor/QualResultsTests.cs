using System.Threading.Tasks;
using DSJTournaments.Api.IntegrationTests.Util;
using DSJTournaments.Data.Schema;
using Xunit;

namespace DSJTournaments.Api.IntegrationTests.Upload.Processor
{
    [Collection("Integration test collection")]
    public class QualResultsTests : IntegrationTestBase
    {
        public QualResultsTests(IntegrationTestFixture fixture) : base(fixture)
        {
        }

        [Fact]
        public async Task CreatesCompetition()
        {
            var response = await Client.UploadStatsAsync(@"
WC Wednesday A - 19.00 CE(S)T 2016-03-02
Park City HS134 Wyniki kwalifikacji (KO)

Poz.  Nr    Zawodnik                 Kraj        Ocena      Długość       Punkty Zakwalifik.
1.    32    SoBo                     POL          1660     127.65 m        131.5           Q
2.    28    Łukasz Bester            POL          1517     127.35 m        129.6            ");

            await ResponseAssert.Ok(response);

            var competitions = await Database.Query<Competition>().AllAsync();

            Assert.Equal(1, competitions.Length);

            Assert.Equal(1, competitions[0].FileNumber);
            Assert.Equal(true, competitions[0].KO);
        }

        [Fact]
        public async Task CreatesQualResult()
        {
            var response = await Client.UploadStatsAsync(@"
WC Wednesday A - 19.00 CE(S)T 2016-03-02
Park City HS134 Wyniki kwalifikacji (KO)

Poz.  Nr    Zawodnik                 Kraj        Ocena      Długość       Punkty Zakwalifik.
1.    32    SoBo                     POL          1660     127.65 m        131.5           Q
2.    28    Łukasz Bester            POL          1517     127.35 m        129.6            ");

            await ResponseAssert.Ok(response);

            var qualResults = await Database.Query<QualificationResult>().AllAsync();
            var sobo = qualResults[0];
            var soboJumper = await Database.Query<Jumper>().Where("id = " + sobo.JumperId).FirstAsync();
            Assert.Equal(1, sobo.Rank);
            Assert.Equal(32, sobo.Bib);
            Assert.Equal("SoBo", soboJumper.Name);
            Assert.Equal("POL", soboJumper.Nation);
            Assert.Equal(1660, sobo.Rating);
            Assert.Equal((decimal?) 127.65, sobo.Length);
            Assert.False(sobo.Crashed);
            Assert.Equal((decimal?) 131.5, sobo.Points);
            Assert.True(sobo.Qualified);
            Assert.True(sobo.Prequalified);
            Assert.Null(sobo.TeamId);
        }

        [Fact]
        public async Task HandlesTeamQualResult()
        {
            var response = await Client.UploadStatsAsync(@"
Team Cup - Thursday 20.00 CE(S)T 2016-03-03
Villach HS98 Wyniki kwalifikacji

Poz.  Nr    Zawodnik                 Kraj        Ocena      Długość       Punkty       Drużyna
1.    7     Erlend Buflod            NOR          1407       98.5 m        136.0       MIX I
2.    10    RUBASZ                   POL          1501       98.5 m        136.0       POL IV ");

            await ResponseAssert.Ok(response);

            var qualResults = await Database.Query<QualificationResult>().AllAsync();
            var erlend = qualResults[0];
            var rubasz = qualResults[1];
            var erlendTeam = await Database.Query<Team>().Where("id=" + erlend.TeamId).FirstAsync();
            var rubaszTeam = await Database.Query<Team>().Where("id=" + rubasz.TeamId).FirstAsync();

            Assert.Equal(1, erlend.Rank);
            Assert.True(erlend.Qualified);
            Assert.Equal("I", erlendTeam.Rank);
            Assert.Equal("MIX", erlendTeam.Nation);

            Assert.Equal(2, rubasz.Rank);
            Assert.Equal("IV", rubaszTeam.Rank);
            Assert.Equal("POL", rubaszTeam.Nation);
        }
    }
}
