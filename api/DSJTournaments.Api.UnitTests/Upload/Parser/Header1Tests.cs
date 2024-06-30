using System;
using System.Globalization;
using System.Threading.Tasks;
using DSJTournaments.Api.Controllers.Upload.Services.Parser;
using Xunit;

namespace DSJTournaments.Api.UnitTests.Upload.Parser
{
    public class Header1Tests
    {
        private readonly StatParser _parser;

        public Header1Tests()
        {
            _parser = new StatParser();
        }

        [Fact]
        public async Task ThrowsGivenInvalidHeader1()
        {
            var ex = await Assert.ThrowsAsync<StatParserException>(() => _parser.Parse("Invalid header1".AsHeader1().Build()));
            Assert.Equal("Can't determine the type of tournament", ex.Message);
        }


        [Fact]
        public async Task DSJ3_WorldCup()
        {
            var stats = await _parser.Parse("WC - Saturday 20.00 CE(S)T 2009-02-21".AsHeader1().Build());

            Assert.Equal(DateTime.Parse("2009-02-21 20:00", CultureInfo.InvariantCulture), stats.Date);
            Assert.Equal("World Cup", stats.Type);
            Assert.Equal(3, stats.GameVersion);
        }

        [Fact]
        public async Task DSJ3_Marathon()
        {
            var stats = await _parser.Parse("WCx3 - 1st Fri 20.00 CE(S)T 2009-02-06".AsHeader1().Build());

            Assert.Equal(DateTime.Parse("2009-02-06 20:00", CultureInfo.InvariantCulture), stats.Date);
            Assert.Equal("Marathon", stats.Type);
            Assert.Equal(3, stats.GameVersion);
        }

        [Fact]
        public async Task DSJ4_WorldCupA()
        {
            var stats = await _parser.Parse("WC Saturday A - 20.00 CE(S)T 2016-02-27".AsHeader1().Build());

            Assert.Equal(DateTime.Parse("2016-02-27 20:00", CultureInfo.InvariantCulture), stats.Date);
            Assert.Equal("World Cup A", stats.Type);
            Assert.Equal(4, stats.GameVersion);
        }

        [Fact]
        public async Task DSJ4_WorldCupB()
        {
            var stats = await _parser.Parse("WC Saturday B - 20.00 CE(S)T 2012-01-07".AsHeader1().Build());

            Assert.Equal(DateTime.Parse("2012-01-07 20:00", CultureInfo.InvariantCulture), stats.Date);
            Assert.Equal("World Cup B", stats.Type);
            Assert.Equal(4, stats.GameVersion);
        }

        [Fact]
        public async Task DSJ4_MarathonA()
        {
            var stats = await _parser.Parse("Marathon A - 1st Fri 20.00 CE(S)T 2012-01-06".AsHeader1().Build());

            Assert.Equal(DateTime.Parse("2012-01-06 20:00", CultureInfo.InvariantCulture), stats.Date);
            Assert.Equal("Marathon A", stats.Type);
            Assert.Equal(4, stats.GameVersion);
        }

        [Fact]
        public async Task DSJ4_MarathonB()
        {
            var stats = await _parser.Parse("Marathon B - 1st Fri 20.00 CE(S)T 2012-01-06".AsHeader1().Build());

            Assert.Equal(DateTime.Parse("2012-01-06 20:00", CultureInfo.InvariantCulture), stats.Date);
            Assert.Equal("Marathon B", stats.Type);
            Assert.Equal(4, stats.GameVersion);
        }

        [Fact]
        public async Task DSJ4_SkiFlyingA()
        {
            var stats = await _parser.Parse("Ski Flying A - 1st Mon 20.00 CE(S)T 2012-05-07".AsHeader1().Build());

            Assert.Equal(DateTime.Parse("2012-05-07 20:00", CultureInfo.InvariantCulture), stats.Date);
            Assert.Equal("Ski Flying A", stats.Type);
            Assert.Equal(4, stats.GameVersion);
        }

        [Fact]
        public async Task DSJ4_SkiFlyingB()
        {
            var stats = await _parser.Parse("Ski Flying B - 1st Mon 20.00 CE(S)T 2012-05-07".AsHeader1().Build());

            Assert.Equal(DateTime.Parse("2012-05-07 20:00", CultureInfo.InvariantCulture), stats.Date);
            Assert.Equal("Ski Flying B", stats.Type);
            Assert.Equal(4, stats.GameVersion);
        }

        [Fact]
        public async Task DSJ4_TeamCup()
        {
            var stats = await _parser.Parse("Team Cup - Thursday 20.00 CE(S)T 2012-11-29".AsHeader1().Build());

            Assert.Equal(DateTime.Parse("2012-11-29 20:00", CultureInfo.InvariantCulture), stats.Date);
            Assert.Equal("Team Cup", stats.Type);
            Assert.Equal(4, stats.GameVersion);
        }

        [Fact]
        public async Task DSJ4_TourDeDSJ()
        {
            var stats = await _parser.Parse("Tour de DSJ 2016 - 2. Tuesday 20.00 CET 2016-02-09".AsHeader1().Build());

            Assert.Equal(DateTime.Parse("2016-02-09 20:00", CultureInfo.InvariantCulture), stats.Date);
            Assert.Equal("Tour de DSJ 2016", stats.Type);
            Assert.Equal(4, stats.GameVersion);
        }

        [Fact]
        public async Task DSJ4_NationalCup()
        {
            var stats = await _parser.Parse("National Cup - Sun 19.00 CE(S)T 2017-12-31".AsHeader1().Build());

            Assert.Equal(DateTime.Parse("2017-12-31 19:00", CultureInfo.InvariantCulture), stats.Date);
            Assert.Equal("National Cup", stats.Type);
            Assert.Equal(4, stats.GameVersion);
        }

        [Fact]
        public async Task DSJ4_20thAnniversary()
        {
            var stats = await _parser.Parse("20th Anniversary Tournament 2019-07-04".AsHeader1().Build());

            Assert.Equal(DateTime.Parse("2019-07-04 20:00", CultureInfo.InvariantCulture), stats.Date);
            Assert.Equal("20th Anniversary Tournament", stats.Type);
            Assert.Equal(4, stats.GameVersion);
        }

        [Fact]
        public async Task DSJ4_CentralEuropeanFour()
        {
            var stats = await _parser.Parse("Central European Four - 1st Mon 20.00 CE(S)T 2021-03-01".AsHeader1().Build());

            Assert.Equal(DateTime.Parse("2021-03-01 20:00", CultureInfo.InvariantCulture), stats.Date);
            Assert.Equal("Central European Four", stats.Type);
            Assert.Equal(4, stats.GameVersion);
        }

        [Fact]
        public async Task DSJ4_NationalCupOddWeeks()
        {
            var stats = await _parser.Parse("National Cup - Thu 20.00 CE(S)T (Odd weeks) 2021-03-04".AsHeader1().Build());

            Assert.Equal(DateTime.Parse("2021-03-04 20:00", CultureInfo.InvariantCulture), stats.Date);
            Assert.Equal("National Cup", stats.Type);
            Assert.Equal(4, stats.GameVersion);
        }

        [Fact]
        public async Task DSJ4_SundaySpecialA()
        {
            var stats = await _parser.Parse("Sunday Special A - 19.00 CE(S)T (Retro + Fict.) 2021-03-28".AsHeader1().Build());

            Assert.Equal(DateTime.Parse("2021-03-28 19:00", CultureInfo.InvariantCulture), stats.Date);
            Assert.Equal("Sunday Special A", stats.Type);
            Assert.Equal(4, stats.GameVersion);
        }

        [Fact]
        public async Task DSJ4_SundaySpecialB()
        {
            var stats = await _parser.Parse("Sunday Special B - 19.00 CE(S)T (DSJ2) 2021-03-07".AsHeader1().Build());

            Assert.Equal(DateTime.Parse("2021-03-07 19:00", CultureInfo.InvariantCulture), stats.Date);
            Assert.Equal("Sunday Special B", stats.Type);
            Assert.Equal(4, stats.GameVersion);
        }

        [Fact]
        public async Task DSJ4_TeamCupEvenWeeks()
        {
            var stats = await _parser.Parse("Team Cup - Thu 20.00 CE(S)T (Even weeks) 2021-03-16".AsHeader1().Build());

            Assert.Equal(DateTime.Parse("2021-03-16 20:00", CultureInfo.InvariantCulture), stats.Date);
            Assert.Equal("Team Cup", stats.Type);
            Assert.Equal(4, stats.GameVersion);
        }
        
        [Fact]
        public async Task DSJ4_OldSchoolTournament()
        {
            var stats = await _parser.Parse("Old School Tournament - Tuesday 21.00 CE(S)T 2022-12-20".AsHeader1().Build());

            Assert.Equal(DateTime.Parse("2022-12-20 21:00", CultureInfo.InvariantCulture), stats.Date);
            Assert.Equal("Old School Tournament", stats.Type);
            Assert.Equal(4, stats.GameVersion);
        }
        
        [Fact]
        public async Task DSJ4_NormalHillsTournament()
        {
            var stats = await _parser.Parse("Normal Hills Tournament - Friday 20.00 CE(S)T 2022-12-30".AsHeader1().Build());

            Assert.Equal(DateTime.Parse("2022-12-30 20:00", CultureInfo.InvariantCulture), stats.Date);
            Assert.Equal("Normal Hills Tournament", stats.Type);
            Assert.Equal(4, stats.GameVersion);
        }
        
        [Fact]
        public async Task DSJ4_25thAnniversary()
        {
            var stats = await _parser.Parse("25th Anniversary Tournament 2024-07-04".AsHeader1().Build());

            Assert.Equal(DateTime.Parse("2024-07-04 20:00", CultureInfo.InvariantCulture), stats.Date);
            Assert.Equal("25th Anniversary Tournament", stats.Type);
            Assert.Equal(4, stats.GameVersion);
        }
    }
}
