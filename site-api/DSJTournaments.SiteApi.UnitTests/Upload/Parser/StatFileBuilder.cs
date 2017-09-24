using System;

namespace dsjtournaments.api.unittests.Upload.Parser
{
    public class StatFileBuilder
    {
        private string _header1;
        private string _header2;
        private string[] _results;

        public StatFileBuilder WithHeader1(string header1)
        {
            _header1 = header1;
            return this;
        }

        public StatFileBuilder WithHeader2(string header2)
        {
            _header2 = header2;
            return this;
        }

        public StatFileBuilder WithResults(params string[] results)
        {
            _results = results;
            return this;
        }

        public string Build()
        {
            return $"{_header1}\r\n{_header2}\r\n\r\n--Ignored--\r\n{string.Join("\r\n", _results ?? new string[0])}";
        }
    }

    public static class StatFileBuilderStringExtensions
    {
        public static StatFileBuilder AsHeader1(this string header1)
        {
            return new StatFileBuilder()
                .WithHeader1(header1)
                .WithHeader2("Standings after 40/40 hills");
        }

        public static StatFileBuilder AsHeader2(this string header2)
        {
            return new StatFileBuilder()
                .WithHeader1("WC - Saturday 20.00 CE(S)T 2009-02-21")
                .WithHeader2(header2);
        }

        public static StatFileBuilder AsFinalStandings(this string[] results)
        {
            return new StatFileBuilder()
                .WithHeader1("WC - Saturday 20.00 CE(S)T 2009-02-21")
                .WithHeader2("Standings after 40/40 hills")
                .WithResults(results);
        }

        public static StatFileBuilder AsTeamFinalStandings(this string[] results)
        {
            return new StatFileBuilder()
                .WithHeader1("Team Cup - Thursday 20.00 CE(S)T 2012-11-29")
                .WithHeader2("Standings after 34/34 hills")
                .WithResults(results);
        }

        public static StatFileBuilder AsFinalResults(this string[] results, int gameVersion)
        {
            if (gameVersion == 3)
            {
                return new StatFileBuilder()
                    .WithHeader1("WC - Saturday 20.00 CE(S)T 2009-02-21")
                    .WithHeader2("Romania HS228 Competition Final Results")
                    .WithResults(results);
            }
            if (gameVersion == 4)
            {
                return new StatFileBuilder()
                    .WithHeader1("WC Wednesday A - 19.00 CE(S)T 2016-02-24")
                    .WithHeader2("Sapporo HS134 Wyniki konkursu (KO)")
                    .WithResults(results);
            }

            throw new ArgumentException(nameof(gameVersion));
        }

        public static StatFileBuilder AsTeamFinalResults(this string[] results)
        {
            return new StatFileBuilder()
                .WithHeader1("Team Cup - Thursday 20.00 CE(S)T 2016-02-18")
                .WithHeader2("Val di Fiemme HS134 Wyniki konkursu")
                .WithResults(results);
        }

        public static StatFileBuilder AsQualResults(this string[] results, int gameVersion)
        {
            if (gameVersion == 3)
            {
                return new StatFileBuilder()
                    .WithHeader1("WC - Tuesday 20.00 CE(S)T 2016-02-23")
                    .WithHeader2("Białoruś HS214 Wyniki kwalifikacji")
                    .WithResults(results);
            }

            if (gameVersion == 4)
            {
                return new StatFileBuilder()
                    .WithHeader1("WC Wednesday A - 19.00 CE(S)T 2016-02-24")
                    .WithHeader2("Garmisch-Partenkirchen HS140 Wyniki kwalifikacji")
                    .WithResults(results);
            }

            throw new ArgumentException(nameof(gameVersion));
        }
    }
}
