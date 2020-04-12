using System.ComponentModel.DataAnnotations;
using DSJTournaments.Api.Validation;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using static DSJTournaments.Data.Schema.RankMethod;

namespace DSJTournaments.Api.Controllers.Cups.RequestModels
{
    public class CupRequestModel
    {
        [Required]
        public string Name { get; set; }

        [Required]
        [OneOf(CupPoints, JumpPoints)]
        public string RankMethod { get; set; }

        [BindRequired]
        public int GameVersion { get; set; }

        [MinLength(1)]
        public CupDateRequestModel[] CupDates { get; set; }
    }
}