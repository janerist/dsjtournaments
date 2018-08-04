using System;
using System.ComponentModel.DataAnnotations;
using DSJTournaments.Mvc.Validation;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using static DSJTournaments.Data.Schema.RankMethod;

namespace DSJTournaments.Api.Controllers.Results.RequestModels
{
    public class GetResultsRequestModel
    {
        public int? GameVersion { get; set; }
        public int? Type { get; set; }
        
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        
        [Required]
        [OneOf(CupPoints, JumpPoints)]
        public string RankMethod { get; set; }
        
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 100;
    }
}