using System;

namespace DSJTournaments.Api.Data.Schema;

[TableName("users")]
public class User
{
    [Key]
    public string Username { get; set; }
    public string PasswordHash { get; set; }
    public DateTime? LastLogin { get; set; }
}