using System;
using System.Security.Claims;
using System.Threading.Tasks;
using DSJTournaments.Api.Controllers.Account.RequestModels;
using DSJTournaments.Api.Controllers.Account.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DSJTournaments.Api.Controllers.Account;

public class AccountController : Controller
{
    private readonly IUserService _userService;

    public AccountController(IUserService userService)
    {
        _userService = userService;
    }
    
    [HttpGet("/account/user")]
    [Authorize("admin")]
    public async Task<IActionResult> GetUser()
    {
        var authenticateResult = await HttpContext.AuthenticateAsync();
        
        return Ok(new
        {
            username = HttpContext.User.Identity!.Name,
            expireIn = (int)(authenticateResult.Ticket!.Properties.ExpiresUtc.Value - DateTimeOffset.UtcNow).TotalSeconds
        });
    }

    [HttpPost("/account/login")]
    public async Task<IActionResult> Login([FromBody]LoginRequestModel model)
    {
        if (await _userService.ValidatePasswordAsync(model.Username, model.Password) is (true, var user))
        {
            // Sign in
            // Update last login
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username)
            };
            
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);
            var properties = new AuthenticationProperties
            {
                IsPersistent = true
            };
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, properties);

            await _userService.UpdateLastLoginAsync(user);
            return Ok();
        }

        return BadRequest(new { message = "Invalid username or password" });
    }

    [HttpPost("/account/logout")]
    [Authorize("admin")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok();
    }
}