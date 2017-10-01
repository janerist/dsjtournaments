using System;
using System.Globalization;
using System.Text.RegularExpressions;

namespace DSJTournaments.SiteApi.Resources.Upload.Services.Parser.ColumnDefs
{
    public class CellValueParsers
    {
        public static int? ParseRank(string rank)
        {
            return string.IsNullOrWhiteSpace(rank)
                ? null
                : (int?) Convert.ToInt32(Regex.Replace(rank, @"[\.\(\)\*]", string.Empty));
        }

        public static int? ParseRating(string rating)
        {
            return string.IsNullOrWhiteSpace(rating)
                ? null
                : (int?) Convert.ToInt32(rating);
        }

        public static int ParsePodium(string podium)
        {
            return podium == "-"
                ? 0
                : Convert.ToInt32(podium);
        }

        public static int? ParseBib(string bib)
        {
            bib = bib?.Replace("*", string.Empty);
            return string.IsNullOrWhiteSpace(bib)
                ? null
                : (int?) Convert.ToInt32(bib.Contains("-")
                    ? bib.Substring(bib.IndexOf("-", StringComparison.Ordinal) + 1)
                    : bib);
        }

        public static bool IsLuckyLoser(string bib)
        {
            return bib != null && bib.EndsWith("*");
        }

        public static decimal? ParseLength(string length)
        {
            return string.IsNullOrWhiteSpace(length) || length == "-"
                ? null
                : (decimal?) Convert.ToDecimal(Regex.Replace(length, @"(\d+\.\d+).+", "$1"), CultureInfo.InvariantCulture);
        }

        public static bool IsCrash(string length)
        {
            return length != null && (length.EndsWith("*") || length.EndsWith("."));
        }

        public static bool IsQualified(string q)
        {
            return !string.IsNullOrWhiteSpace(q);
        }

        public static bool IsPrequalified(string q)
        {
            return q == "Q" || q == "J" || q == "k";
        }

        public static string ParseTeam(string q)
        {
            return q != null && Regex.IsMatch(q, @"^[A-Z]{3} [IVX]+$")
                ? q
                : null;
        }

        public static decimal ConvertToDecimalInvariantCulture(string value)
        {
            return Convert.ToDecimal(value, CultureInfo.InvariantCulture);
        }
    }
}