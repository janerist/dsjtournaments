using System.Linq;
using System.Threading.Tasks;
using DSJTournaments.Api.Data.Schema;
using DSJTournaments.Api.IntegrationTests.Util;
using Xunit;

namespace DSJTournaments.Api.IntegrationTests.Upload.Processor
{
    [Collection("Integration test collection")]
    public class FinalResultsTests : IntegrationTestBase
    {
        public FinalResultsTests(IntegrationTestFixture fixture) : base(fixture)
        {
        }

        [Fact]
        public async Task CreatesCompetition()
        {
            var response = await Client.UploadStatsAsync(@"
WC Wednesday A - 19.00 CE(S)T 2016-03-02
Bad Mitterndorf HS200 Wyniki konkursu

Poz.  Nr    Zawodnik                 Kraj        Ocena      I seria     II seria       Punkty
1.    33    SoBo                     POL          1673      215.5 m      212.0 m        423.0
2.    34    Bartek Winczaszek        POL          1764      217.5 m      210.5 m        420.1", 
            fileName: "Bla bla bla Wyniki konkursu[2].txt");

            await ResponseAssert.Ok(response);

            var competition = await Database.Query<Competition>().FirstAsync();
            var hill = await Database.Query<Hill>().Where("id=" + competition.HillId).FirstAsync();

            Assert.Equal(2, competition.FileNumber);
            Assert.False(competition.KO);
            Assert.Equal("Bad Mitterndorf HS200", hill.Name);
        }

        [Fact]
        public async Task CreatesFinalResult()
        {
            var response = await Client.UploadStatsAsync(@"
WC Wednesday A - 19.00 CE(S)T 2016-03-02
Bad Mitterndorf HS200 Wyniki konkursu

Poz.  Nr    Zawodnik                 Kraj        Ocena      I seria     II seria       Punkty
1.    33    SoBo                     POL          1673      215.5 m      212.0 m        423.0
2.    34    Bartek Winczaszek        POL          1764      217.5 m      210.5 m        420.1");

            await ResponseAssert.Ok(response);

            var finalResults = await Database.Query<FinalResult>().AllAsync();
            Assert.Equal(2, finalResults.Length);

            var sobo = finalResults[0];
            var soboJumper = await Database.Query<Jumper>().Where("id=" + sobo.JumperId).FirstAsync();

            Assert.Equal(1, sobo.Rank);
            Assert.Equal(33, sobo.Bib);
            Assert.Equal("SoBo", soboJumper.Name);
            Assert.Equal("POL", soboJumper.Nation);
            Assert.Equal(1673, sobo.Rating);
            Assert.Equal((decimal?) 215.5, sobo.Length1);
            Assert.False(sobo.Crashed1);
            Assert.Equal((decimal?) 212.0, sobo.Length2);
            Assert.False(sobo.Crashed2);
            Assert.Equal((decimal) 423.0, sobo.Points);
        }

        [Fact]
        public async Task CreatesTeamFinalResults()
        {
            var response = await Client.UploadStatsAsync(@"
Team Cup - Thursday 20.00 CE(S)T 2016-03-03
Garmisch-Partenkirchen HS140 Wyniki konkursu

Poz.  Nr    Zawodnik                     Kraj        Ocena      I seria     II seria       Punkty
1.    7     Polska I                     POL                                               1078.7
      7-1   Adrian Kruszec               POL          1302      135.5 m      136.0 m        275.2    (4.)
      7-2   RUBASZ                       POL          1515      137.0 m      134.5 m        277.2    (2.)
      7-3   Jakub Karas                  POL          1280      135.0 m      134.0 m        270.2    (7.)
      7-4   Andrzej Tomaszek             POL          1434      129.0 m      133.0 m        256.1   (16.)

2.    6     Polska II                    POL                                               1050.4
      6-1   Robert Szczepaniak           POL          1405      136.0 m      136.5 m        277.5    (1.)
      6-2   Daniel Szymaniak             POL          1186      135.0 m      131.5 m        262.7   (12.)
      6-3   Dawid Bocianowski            POL          1560      135.5 m      137.0 m        276.5    (3.)
      6-4   Krystian Petryński           POL           849      129.0 m      125.0 m        233.7   (24.)

3.    3     Mieszane drużyny  I          MIX                                               1049.5
      3-1   Yuichi Ono                   JPN          1084      125.0 m      132.5 m        248.5   (22.)
      3-2   sveinung kolsvik 4           NOR          1200      134.5 m      132.0 m        264.7   (11.)
      3-3   Peter Mack                   AUT          1116      135.0 m      132.0 m        266.1   (10.)
      3-4   Erlend Buflod                NOR          1404      135.5 m      136.0 m        270.2    (7.)

4.    4     Słowenia I                   SLO                                               1047.6
      4-1   Simon Halužan                SLO          1000      127.0 m      134.0 m        253.3   (20.)
      4-2   Luka Potočar                 SLO           973      128.0 m      129.0 m        249.6   (21.)
      4-3   Daniel Kump                  SLO          1265      135.0 m      134.0 m        271.2    (6.)
      4-4   Drago Oven                   SLO          1570      135.0 m      135.0 m        273.5    (5.)

5.    5     Polska III                   POL                                               1030.4
      5-1   Jacek Myszor                 POL          1074      129.5 m      129.0 m        248.3   (23.)
      5-2   Michał Piwowarski            POL          1130      135.0 m      131.0 m        260.8   (13.)
      5-3   Sergiusz Kriegel             POL          1391      131.5 m      136.5 m        266.4    (9.)
      5-4   Łukasz Kościesza             POL          1184      129.5 m      131.0 m        254.9   (17.)

6.    2     Mieszane drużyny  II         MIX                                                884.9
      2-1   ANTE MARTINIS                CRO          1079      130.5 m      132.0 m        258.0   (15.)
      2-2   David Ledinek                SLO           932       47.0 m      124.0 m        114.7   (25.)
      2-3   Kai Backes                   GER          1039      133.0 m      130.5 m        258.3   (14.)
      2-4   Marcus Schütte               GER          1167      129.5 m      131.0 m        253.9   (19.)

7.    1     Mieszane drużyny  III        MIX                                                254.5
      1-1   Gabriele Schwarz 2           GER          1149        0.0 m        0.0 m          0.0   (26.)
      1-2   Rafał Tissarek               POL           935      133.0 m      129.5 m        254.5   (18.)");

            await ResponseAssert.Ok(response);

            var teamFinalResults = await Database.Query<TeamFinalResult>().AllAsync();
            var jumperFinalResults = await Database.Query<FinalResult>().AllAsync();
            var teams = await Database.Query<Team>().AllAsync();
            var jumpers = await Database.Query<Jumper>().AllAsync();

            var pol1 = teamFinalResults[0];
            var pol1Team = teams[0];
            var adrian = jumperFinalResults.First(j => j.TeamResultId == pol1.Id);
            var adrianJumper = jumpers.Single(j => j.Id == adrian.JumperId);

            Assert.Equal(1, pol1.Rank);
            Assert.Equal(7, pol1.Bib);
            Assert.Equal("I", pol1Team.Rank);
            Assert.Equal("POL", pol1Team.Nation);
            Assert.Equal((decimal) 1078.7, pol1.Points);
            
            Assert.Equal(4, adrian.Rank);
            Assert.Equal(1, adrian.Bib);
            Assert.Equal("Adrian Kruszec", adrianJumper.Name);
            Assert.Equal("POL", adrianJumper.Nation);
            Assert.Equal(1302, adrian.Rating);
            Assert.Equal((decimal?) 135.5, adrian.Length1);
            Assert.False(adrian.Crashed1);
            Assert.Equal((decimal?) 136.0, adrian.Length2);
            Assert.False(adrian.Crashed2);
            Assert.Equal((decimal) 275.2, adrian.Points);
        }
    }
}
