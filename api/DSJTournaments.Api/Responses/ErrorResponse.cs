using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace DSJTournaments.Api.Responses
{
    public class ErrorResponse
    {
        public ErrorResponse()
        {
        }

        public ErrorResponse(string message)
        {
            Message = message;
        }

        public ErrorResponse(ModelStateDictionary modelState)
        {
            Message = "Bad request";
            ValidationErrors = new Dictionary<string, IEnumerable<string>>();

            var keys = modelState.Keys.ToList();
            var values = modelState.Values.ToList();

            for (var i = 0; i < values.Count; i++)
            {
                var value = values[i];

                if (keys.Count <= i)
                {
                    // Keys not available for some reason.
                    break;
                }

                var key = char.ToLower(keys[i][0]) + keys[i].Substring(1);

                if (value.ValidationState != ModelValidationState.Invalid || value.Errors.Count == 0)
                {
                    continue;
                }

                var errors = value.Errors.Select(e => e.ErrorMessage);
                ValidationErrors.Add(key, errors);
            }
        }

        public string Message { get; set; }
        public Dictionary<string, IEnumerable<string>> ValidationErrors { get; set; }
        // For use in development environments.
        public string ExceptionMessage { get; set; }
        public string ExceptionStackTrace { get; set; }
        public string InnerExceptionMessage { get; set; }
    }
}