using System.ComponentModel.DataAnnotations;
using DSJTournaments.Api.Infrastructure.Validation;
using static DSJTournaments.Api.Data.Schema.RankMethod;

namespace DSJTournaments.Api.Resources.Cups.RequestModels
{
    public class CupRequestModel
    {
        [Required]
        public string Name { get; set; }

        [Required]
        [OneOf(CupPoints, JumpPoints)]
        public string RankMethod { get; set; }

        [Required]
        public int? GameVersion { get; set; }

        [MinLength(1)]
        public CupDateRequestModel[] CupDates { get; set; }
    }
}