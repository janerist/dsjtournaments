using System;
using System.Net;

namespace DSJTournaments.Api.Data.Schema;

[TableName("uploads")]
public class Upload
{
    public int Id { get; set; }
    public string Path { get; set; }
    public IPAddress RemoteIp { get; set; }
    public DateTime UploadedAt { get; set; }
}