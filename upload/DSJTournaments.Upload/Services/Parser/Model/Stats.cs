using System;

namespace DSJTournaments.Upload.Services.Parser.Model
{
    public class Stats
    {
        public DateTime Date { get; set; }
        public string Type { get; set; }
        public int GameVersion { get; set; }
    }

    public abstract class Stats<TResult> : Stats
    {
        public TResult[] Results { get; set; }
    }
}
