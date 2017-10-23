using System;

namespace DSJTournaments.Api.Controllers.Cups.ResponseModels
{
    public class CupDateResponseModel
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public int? TournamentTypeId { get; set; }
        public int? TournamentId { get; set; }
    }
}