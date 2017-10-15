using System;

namespace DSJTournaments.Api.Resources.Upload.Services.Parser
{
    public class StatParserException : Exception
    {
        //
        // For guidelines regarding the creation of new exception types, see
        //    http://msdn.microsoft.com/library/default.asp?url=/library/en-us/cpgenref/html/cpconerrorraisinghandlingguidelines.asp
        // and
        //    http://msdn.microsoft.com/library/default.asp?url=/library/en-us/dncscol/html/csharp07192001.asp
        //

        public StatParserException()
        {
        }

        public StatParserException(string message) : base(message)
        {
        }

        public StatParserException(string message, Exception inner) : base(message, inner)
        {
        }
    }
}