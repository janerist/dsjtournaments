using System;

namespace DSJTournaments.Api.Data.Schema;

[TableName("jumpers")]
public class Jumper
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Nation { get; set; }
    public string GravatarEmail { get; set; }
        
    [Write(false)]
    public DateTime CreatedAt { get; set; }
    [Write(false)]
    public DateTime UpdatedAt { get; set; }
}