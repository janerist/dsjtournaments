using System.Threading.Tasks;
using DSJTournaments.Data.Schema;
using DSJTournaments.Upload.IntegrationTests.Util;
using DSJTournaments.Upload.Services.Parser;
using Xunit;

namespace DSJTournaments.Upload.IntegrationTests.Upload.Processor
{
    [Collection("Integration test collection")]
    public class FinalStandingsTests : IntegrationTestBase
    {
        public FinalStandingsTests(IntegrationTestFixture fixture) : base(fixture)
        {
        }

        [Fact]
        public async Task CreatesTournament()
        {
            var response = await Client.UploadStatsAsync(@"
WC - Sunday 20.00 CE(S)T 2015-11-08
Final Results After 40/40 Hills

--- Ignored ---");
            
            await ResponseAssert.Ok(response);

            var tournament = await Database.Query<Tournament>().FirstAsync();
            var tournamentType = await Database.Query<TournamentType>()
                .Where("id = @Id", new {Id = tournament.TournamentTypeId})
                .FirstAsync();
            
            Assert.Equal("World Cup", tournamentType.Name);
            Assert.Equal(3, tournament.GameVersion);
            Assert.Equal("2015-11-08T20:00:00", tournament.Date.ToString("s"));
            Assert.Equal(40, tournament.HillCount);
        }

        [Fact]
        public async Task DeletedTournamentsAreRejected()
        {
            var stats = @"
WC - Sunday 20.00 CE(S)T 2015-11-08
Final Results After 40/40 Hills

--- Ignored ---";
            
            var response = await Client.UploadStatsAsync(stats);
            
            await ResponseAssert.Ok(response);
            var tournament = await Database.Query<Tournament>().FirstAsync();

            await Database.Insert(new DeletedTournament
            {
                Date = tournament.Date,
                TournamentTypeId = tournament.TournamentTypeId,
                SubType = tournament.SubType
            });

            await Database.Delete<Tournament>(tournament.Id);

            response = await Client.UploadStatsAsync(stats);
            var error = await ResponseAssert.BadRequest(response);
            
            Assert.Equal("Rejected", error.Message);
        }

        [Fact]
        public async Task CreatesFinalStandings()
        {
            var response = await Client.UploadStatsAsync(@"
WC - Sunday 20.00 CE(S)T 2015-11-08
Final Results After 40/40 Hills

Rank  Name                     Nation     Rating     I    II   III     N     Points
1.    Martin Kafka             CZE          1236    40     -     -    40       4000
2.    Dominik Andrzejczuk      POL           992     -    40     -    40       3200");

            await ResponseAssert.Ok(response);

            var tournaments = await Database.Query<Tournament>().AllAsync();
            var jumpers = await Database.Query<Jumper>().AllAsync();
            var finalStandings = await Database.Query<FinalStanding>().AllAsync();

            Assert.Single(tournaments);
            Assert.Equal(2, jumpers.Length);
            Assert.Equal(2, finalStandings.Length);

            Assert.Collection(jumpers,
                martin =>
                {
                    Assert.Equal("Martin Kafka", martin.Name);
                    Assert.Equal("CZE", martin.Nation);
                },

                dominik =>
                {
                    Assert.Equal("Dominik Andrzejczuk", dominik.Name);
                    Assert.Equal("POL", dominik.Nation);
                });

            Assert.Collection(finalStandings,
                martin =>
                {
                    Assert.Equal(1, martin.Rank);
                    Assert.Equal(1236, martin.Rating);
                    Assert.Equal(40, martin.I);
                    Assert.Equal(0, martin.II);
                    Assert.Equal(0, martin.III);
                    Assert.Equal(40, martin.N);
                    Assert.Equal(4000, martin.Points);
                    Assert.Equal(100, martin.CupPoints);
                },

                dominik =>
                {
                    Assert.Equal(2, dominik.Rank);
                    Assert.Equal(992, dominik.Rating);
                    Assert.Equal(0, dominik.I);
                    Assert.Equal(40, dominik.II);
                    Assert.Equal(0, dominik.III);
                    Assert.Equal(40, dominik.N);
                    Assert.Equal(3200, dominik.Points);
                    Assert.Equal(80, dominik.CupPoints);
                });
        }

        [Fact]
        public async Task CreatesTeamFinalStandings()
        {
            var response = await Client.UploadStatsAsync(@"
Team Cup - Thursday 20.00 CE(S)T 2016-02-25
Klasyfikacja końcowa po 24/24 konkursach

Poz.  Gracz                        Kraj         I    II   III     N     Punkty
1.    Polska I                     POL         14     5     2    24       8650
2.    Mieszane drużyny  I          MIX          7     8     4    24       7900
3.    Polska II                    POL          3     3     7    23       6600
4.    Słowenia I                   SLO          1     5     6    22       6150
5.    Mieszane drużyny  II         MIX          -     2     4    24       5450
6.    Mieszane drużyny  III        MIX          -     -     1    21       3450
7.    Polska III                   POL          -     -     -     4        900
8.    Mieszane drużyny  IV         MIX          -     -     -     5        550");

            await ResponseAssert.Ok(response);

            var tournament = await Database.Query<Tournament>().FirstAsync();
            Assert.Equal(24, tournament.HillCount);

            var teams = await Database.Query<Team>().AllAsync();
            var teamFinalStandings = await Database.Query<FinalStanding>().AllAsync();

            Assert.Equal(8, teams.Length);
            Assert.Equal(8, teamFinalStandings.Length);

            var pol1 = teamFinalStandings[0];

            Assert.Equal(1, pol1.Rank);
            Assert.Equal(14, pol1.I);
            Assert.Equal(5, pol1.II);
            Assert.Equal(2, pol1.III);
            Assert.Equal(24, pol1.N);
            Assert.Equal(8650, pol1.Points);
            Assert.Equal(100, pol1.CupPoints);
        }
        
        [Fact]
        public async Task CreatesNationalCupSubType()
        {
            var response = await Client.UploadStatsAsync(@"
National Cup - Sun 19.00 CE(S)T 2017-12-31
Klasyfikacja końcowa po 24/24 konkursach

Poz.  Gracz                    Kraj        Ocena     I    II   III     N     Punkty
1.    Mariusz Sobon            POL          1638     5     6     4    23       1528
2.    Michał Kwiatkowski       POL          1645     2     6     3    23       1364
3.    Maciej Sylwestrzuk       POL          1731     8     1     1    16       1170");

            await ResponseAssert.Ok(response);

            var tournament = await Database.Query<Tournament>().FirstAsync();
            Assert.Equal("POL", tournament.SubType);
        }
        
        [Fact]
        public async Task CanCreateMultipleNationalCupOnSameDate()
        {
            var czeRespone = await Client.UploadStatsAsync(@"
National Cup - Sun 19.00 CE(S)T 2018-12-23
Final Results After 24/24 Hills
  
Rank  Name                     Nation     Rating     I    II   III     N     Points
1.    Jan Štěrba Jr.           CZE          1226     9    14     -    24       2070
2.    Peter Samuelis           CZE          1274    10     8     5    24       1990
3.    Slawomir Gwizdak         CZE           749     -     1     8    15        860");

            await ResponseAssert.Ok(czeRespone);
            
            var polResponse = await Client.UploadStatsAsync(@"
National Cup - Sun 19.00 CE(S)T 2018-12-23
Klasyfikacja końcowa po 24/24 konkursach

Poz.  Gracz                    Kraj        Ocena     I    II   III     N     Punkty
1.    Mariusz Sobon            POL          1638     5     6     4    23       1528
2.    Michał Kwiatkowski       POL          1645     2     6     3    23       1364
3.    Maciej Sylwestrzuk       POL          1731     8     1     1    16       1170");

            await ResponseAssert.Ok(polResponse);
            
            var tournaments = await Database.Query<Tournament>().OrderBy("id").AllAsync();
            Assert.Equal("CZE", tournaments[0].SubType);
            Assert.Equal("POL", tournaments[1].SubType);
        }
    }
}