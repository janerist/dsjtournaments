using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace DSJTournaments.Api.Auth;

public static class AuthorizationPolicyBuilderExtensions
{
    public static AuthorizationPolicyBuilder RequireCsrfHeader(this AuthorizationPolicyBuilder builder)
    {
        return builder.AddRequirements(new CsrfHeaderRequirement());
    }
}

public class CsrfHeaderRequirement : IAuthorizationRequirement;

public class CsrfHeaderRequirementHandler(IHttpContextAccessor httpContextAccessor)
    : AuthorizationHandler<CsrfHeaderRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, CsrfHeaderRequirement requirement)
    {
        if (httpContextAccessor.HttpContext?.Request.Headers is {} headers && headers.ContainsKey("X-CSRF"))
        {
            context.Succeed(requirement);
        }
        
        return Task.CompletedTask;
    }
}