using System;
using System.Threading.Tasks;
using DSJTournaments.Api.Data;
using DSJTournaments.Api.Data.Schema;

namespace DSJTournaments.Api.Controllers.Account.Services;

public interface IUserService
{
    Task<(bool, User)> ValidatePasswordAsync(string userName, string password);
    Task UpdateLastLoginAsync(User user);
}
    
public class UserService : IUserService
{
    private readonly Database _database;
    private readonly PasswordHasher _passwordHasher;

    public UserService(Database database, PasswordHasher passwordHasher)
    {
        _database = database;
        _passwordHasher = passwordHasher;
    }

    public async Task<(bool, User)> ValidatePasswordAsync(string userName, string password)
    {
        var user = await _database.Query<User>()
            .Where("username = @UserName", new {UserName = userName})
            .FirstOrDefaultAsync();

        if (user == null || !_passwordHasher.VerifyHashedPassword(user.PasswordHash, password))
        {
            return (false, null);
        }

        return (true, user);
    }

    public Task UpdateLastLoginAsync(User user)
    {
        return _database.Update<User, string>(user, u => u.LastLogin = DateTime.Now);
    }
}