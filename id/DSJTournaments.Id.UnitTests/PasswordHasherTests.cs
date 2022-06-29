using DSJTournaments.Id.Services;
using Xunit;

namespace DSJTournaments.Id.UnitTests
{
    public class PasswordHasherTests
    {
        private readonly PasswordHasher _passwordHasher;
        
        public PasswordHasherTests()
        {
            _passwordHasher = new PasswordHasher();
        }

        [Fact]
        public void VerifiesHashedPassword()
        {
            const string password = "hunter2";

            var hashedPassword = _passwordHasher.HashPassword(password);

            bool result = _passwordHasher.VerifyHashedPassword(hashedPassword, password);
            
            Assert.True(result);
        }
    }
}