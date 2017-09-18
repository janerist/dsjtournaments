using System.ComponentModel.DataAnnotations;
using DSJTournaments.Api.Infrastructure.Validation;

namespace DSJTournaments.Api.Resources.Jumpers.RequestModels
{
    public class JumperUpdateRequestModel
    {
        [Required]
        [CountryCode]
        public string Nation { get; set; }
    }
}