using System;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace DSJTournaments.Mvc.Exceptions
{
    public class BadRequestException : Exception
    {
        public BadRequestException(string message) : base(message) { }

        public BadRequestException(string key, string errorMessage)
            : base("Validation errors.")
        {
            ModelState = new ModelStateDictionary();
            ModelState.AddModelError(key, errorMessage);
        }

        public BadRequestException(ModelStateDictionary modelState)
            : base("Validation errors.")
        {
            if (modelState.IsValid || modelState.ErrorCount == 0)
            {
                return;
            }

            ModelState = modelState;
        }

        public ModelStateDictionary ModelState { get; set; }
    }

}