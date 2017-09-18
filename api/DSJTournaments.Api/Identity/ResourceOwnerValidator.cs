using System;
using System.Threading.Tasks;
using DSJTournaments.Api.Data;
using DSJTournaments.Api.Data.Schema;
using IdentityServer4.Models;
using IdentityServer4.Validation;

namespace DSJTournaments.Api.Identity
{
    public class ResourceOwnerValidator : IResourceOwnerPasswordValidator
    {
        private readonly Database _database;
        private readonly PasswordHasher _passwordHasher;

        public ResourceOwnerValidator(Database database, PasswordHasher passwordHasher)
        {
            _database = database;
            _passwordHasher = passwordHasher;
        }

        public async Task ValidateAsync(ResourceOwnerPasswordValidationContext context)
        {
            var user = await _database.Query<User>()
                .Where("username = @UserName", new {context.UserName})
                .FirstOrDefaultAsync();

            if (user == null || !PasswordMatch(user, context.Password))
            {
                context.Result = new GrantValidationResult(TokenRequestErrors.InvalidGrant,
                    "Invalid username or password.");
            }
            else
            {
                await _database.Update<User, string>(user, u => u.LastLogin = DateTime.Now);
                context.Result = new GrantValidationResult(user.Username, "application");
            }
        }

        private bool PasswordMatch(User user, string typedPassword)
        {
            var saltBytes = Convert.FromBase64String(user.Salt);
            var hashedPassword = _passwordHasher.HashPassword(typedPassword, saltBytes);

            return user.PasswordHash == hashedPassword;
        }
    }
}
