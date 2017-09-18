using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace DSJTournaments.Api.Infrastructure.Validation
{
    public class CountryCodeAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value == null || CountryCodes.Iso3.Contains(value.ToString().ToUpper()))
            {
                return null;
            }

            return new ValidationResult($"The value '{value}' is not a valid ISO 3166-1 alpha-3 country code.");
        }
    }
}
