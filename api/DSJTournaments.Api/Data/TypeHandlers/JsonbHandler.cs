using System;
using System.Data;
using System.Text.Json;
using Dapper;
using Npgsql;
using NpgsqlTypes;

namespace DSJTournaments.Api.Data.TypeHandlers;

public class JsonbHandler<T> : SqlMapper.TypeHandler<T> where T: class
{
    public override void SetValue(IDbDataParameter parameter, T value)
    {
        if (parameter is NpgsqlParameter npgsqlParam)
        {
            npgsqlParam.NpgsqlDbType = NpgsqlDbType.Jsonb;
        }
            
        parameter.Value = JsonSerializer.Serialize(value);
    }

    public override T Parse(object value)
    {
        if (value == null || value == DBNull.Value)
        {
            return null;
        }

        return JsonSerializer.Deserialize<T>(value.ToString());
    }
}