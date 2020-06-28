using IdentityServer4;
using IdentityServer4.Models;
using Microsoft.Extensions.Configuration;

namespace DSJTournaments.Id
{
    public static class IdentityConfig
    {
        public static Client[] GetClients(IConfiguration configuration)
        {
            return configuration.GetSection("Clients").Get<Client[]>();
        }
        
        public static readonly ApiScope[] ApiScopes =
        {
            new ApiScope(IdentityServerConstants.StandardScopes.OpenId),
            new ApiScope("dsjt")
        };

        public static readonly ApiResource[] ApiResources = {
            new ApiResource("dsjt", "DSJT API")
            {
                Scopes = { "dsjt"}
            }
        };
    }
}
