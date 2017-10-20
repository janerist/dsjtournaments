using System;
using System.ComponentModel.DataAnnotations;

namespace DSJTournaments.Api.Resources.Cups.RequestModels
{
    public class GetCupsRequestModel
    {
        [RegularExpression(@"\d{4}-\d{4}", ErrorMessage = "Must be a valid season (e.g. 2017-2018)")]
        public string Season { get; set; }

        [Range(1, Int32.MaxValue)]
        public int Page { get; set; } = 1;
        
        [Range(0, 100)]
        public int PageSize { get; set; } = 20;
    }
}