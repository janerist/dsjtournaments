using System;

namespace DSJTournaments.Upload.Services.Processor
{
    public class StatProcessorException : Exception
    {
        //
        // For guidelines regarding the creation of new exception types, see
        //    http://msdn.microsoft.com/library/default.asp?url=/library/en-us/cpgenref/html/cpconerrorraisinghandlingguidelines.asp
        // and
        //    http://msdn.microsoft.com/library/default.asp?url=/library/en-us/dncscol/html/csharp07192001.asp
        //

        public StatProcessorException()
        {
        }

        public StatProcessorException(string message) : base(message)
        {
        }

        public StatProcessorException(string message, Exception inner) : base(message, inner)
        {
        }
    }
}