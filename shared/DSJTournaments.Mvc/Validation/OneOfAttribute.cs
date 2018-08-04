using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DSJTournaments.Mvc.Validation
{
    public class OneOfAttribute : ValidationAttribute
    {
        private readonly IList<object> _values;

        public OneOfAttribute(params object[] values)
        {
            _values = values;
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value == null || _values.Contains(value))
                return null;

            var validValues = string.Join(", ", _values);
            return new ValidationResult($@"Must be one of '{validValues}'.");
        }
    }
}
