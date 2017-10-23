using System;
using DSJTournaments.Api.Controllers.Cups.ResponseModels;

namespace DSJTournaments.Api.Controllers.Tournaments.ResponseModels
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

        public FinalStandingResponseModel[] Top3 { get; set; }
        public CompetitionResponseModel[] Competitions { get; set; }
        public CupResponseModel[] Cups { get; set; }
    }
}