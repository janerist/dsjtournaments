﻿using System;
using IdentityServer4.Models;

namespace DSJTournaments.Id
{
    public static class IdentityConfig
    {
        public static Client[] Clients = {
            new Client
            {
                ClientId = "admin",
                ClientName = "DSJT Admin",
                RequireClientSecret = false,
                AllowedGrantTypes = GrantTypes.ResourceOwnerPassword,
                AllowAccessTokensViaBrowser = true,
                AllowedScopes = {
                    "dsjt"
                },

                AccessTokenLifetime = (int) TimeSpan.FromHours(48).TotalSeconds
            }
        };

        public static ApiResource[] ApiResources = {
            new ApiResource("dsjt", "DSJT API")
        };
    }
}