using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace DSJTournaments.Api.ActionFilters
{
    public class WrapResultInDataPropertyAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuted(ActionExecutedContext context)
        {
            if (context.Result is ObjectResult content)
            {
                context.Result = new ObjectResult(new { Data = content.Value});
            }
        }
    }
}