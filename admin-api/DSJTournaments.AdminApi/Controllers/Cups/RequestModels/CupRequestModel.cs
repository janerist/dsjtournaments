using System.ComponentModel.DataAnnotations;
using DSJTournaments.AdminApi.Validation;

namespace DSJTournaments.AdminApi.Controllers.Cups.RequestModels
{
    public class CupRequestModel
    {
        [Required]
        public string Name { get; set; }

        [Required]
        [OneOf(Data.Schema.RankMethod.CupPoints, Data.Schema.RankMethod.JumpPoints)]
        public string RankMethod { get; set; }

        [Required]
        public int? GameVersion { get; set; }

        [MinLength(1)]
        public CupDateRequestModel[] CupDates { get; set; }
    }
}