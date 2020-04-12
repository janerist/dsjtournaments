using System.ComponentModel.DataAnnotations;
using DSJTournaments.Api.Validation;

namespace DSJTournaments.Api.Controllers.Jumpers.RequestModels
{
    public class JumperUpdateRequestModel
    {
        [Required]
        [CountryCode]
        public string Nation { get; set; }
        
        [EmailAddress]
        public string GravatarEmail { get; set; }
    }
}