using System;
using System.ComponentModel.DataAnnotations;

namespace DSJTournaments.Api.Controllers.Jumpers.RequestModels
{
    public class GetJumpersRequestModel
    {
        public string Q { get; set; }
        public JumperSort? Sort { get; set; }
        
        [Range(1, Int32.MaxValue)]
        public int Page { get; set; } = 1;
        
        [Range(0, 100)]
        public int PageSize { get; set; } = 70;
    }
}