using System;

namespace DSJTournaments.Data.Schema
{
    [TableName("cups")]
    public class Cup
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string RankMethod { get; set; }
        public int GameVersion { get; set; }
        
        [Write(false)]
        public DateTime CreatedAt { get; set; }
        [Write(false)]
        public DateTime UpdatedAt { get; set; }
    }
}