using System.ComponentModel.DataAnnotations;
using DSJTournaments.AdminApi.Validation;

namespace DSJTournaments.AdminApi.Resources.Jumpers.RequestModels
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