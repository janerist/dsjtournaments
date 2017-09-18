using System.Text.RegularExpressions;

namespace DSJTournaments.Api.Data
{
    internal static class ExtensionMethods
    {
        public static string ToSnakeCase(this string input)
        {
            return Regex.Replace(
                Regex.Replace(
                    Regex.Replace(input, @"([A-Z]+)([A-Z][a-z])", "$1_$2"), @"([a-z\d])([A-Z])", "$1_$2"), @"[-\s]", "_").ToLower();
        }
    }
}
