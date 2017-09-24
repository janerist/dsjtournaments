using System;

namespace DSJTournaments.AdminApi.Resources.Tournaments.ResponseModels
{
    public class TournamentResponseModel
    {
        public int Id { get; set; }
        public int TournamentTypeId { get; set; }
        public string Type { get; set; }
        public DateTime Date { get; set; }
        public int GameVersion { get; set; }
        public int HillCount { get; set; }
        public int ParticipantCount { get; set; }
    }
}