using System.Reflection;
using Duende.IdentityServer.Hosting;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace DSJTournaments.Id.Pages;

[AllowAnonymous]
public class Index : PageModel
{
    public string Version;
        
    public void OnGet()
    {
        Version = typeof(IdentityServerMiddleware).Assembly.GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion.Split('+').First();
    }
}