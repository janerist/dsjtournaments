using Duende.IdentityServer.Models;

namespace DSJTournaments.Id;

public static class Config
{
    public static IEnumerable<IdentityResource> IdentityResources =>
        new IdentityResource[]
        {
            new IdentityResources.OpenId(),
            new IdentityResources.Profile(),
        };

    public static IEnumerable<ApiScope> ApiScopes =>
        new[]
        {
            new ApiScope("dsjt")
        };

    
    public static Client[] GetClients(IConfiguration configuration)
    {
        return configuration.GetSection("Clients").Get<Client[]>();
    }
}
