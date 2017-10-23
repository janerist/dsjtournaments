using System;
using System.ComponentModel.DataAnnotations;

namespace DSJTournaments.Api.Controllers.Tournaments.RequestModels
{
    public class GetTournamentsRequestModel
    {
        public int? Type { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public TournamentSort? Sort { get; set; }
        
        [Range(1, Int32.MaxValue)]
        public int Page { get; set; } = 1;
        
        [Range(0, 100)]
        public int PageSize { get; set; } = 10;
    }
}