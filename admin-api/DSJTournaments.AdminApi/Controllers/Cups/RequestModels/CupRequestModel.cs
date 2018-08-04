﻿using System.ComponentModel.DataAnnotations;
using DSJTournaments.Mvc.Validation;
using static DSJTournaments.Data.Schema.RankMethod;

namespace DSJTournaments.AdminApi.Controllers.Cups.RequestModels
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