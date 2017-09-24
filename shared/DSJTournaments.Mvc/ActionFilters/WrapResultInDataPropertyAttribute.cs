using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace DSJTournaments.Mvc.ActionFilters
{
    public class WrapResultInDataPropertyAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuted(ActionExecutedContext context)
        {
            var content = context.Result as ObjectResult;
            if (content != null)
            {
                content.Value = new
                {
                    Data = content.Value
                };
            }
        }
    }
}