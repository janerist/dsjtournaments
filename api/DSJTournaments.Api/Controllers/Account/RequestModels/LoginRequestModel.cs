using System.ComponentModel.DataAnnotations;

namespace DSJTournaments.Api.Controllers.Account.RequestModels;

public class LoginRequestModel
{
    [Required]
    public string Username { get; set; }
    
    [Required]
    public string Password { get; set; }
}