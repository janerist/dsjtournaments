using System.IO;
using System.Text;

namespace DSJTournaments.Upload.IntegrationTests.Util
{
    public static class StringExtensions
    {
        public static Stream ToStream(this string s, Encoding encoding = null)
        {
            return new MemoryStream((encoding ?? Encoding.UTF8).GetBytes(s));
        }
    }
}