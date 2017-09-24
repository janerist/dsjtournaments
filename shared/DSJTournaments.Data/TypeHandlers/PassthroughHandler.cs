using System;
using System.Data;
using Dapper;
using Npgsql;
using NpgsqlTypes;

namespace DSJTournaments.Data.TypeHandlers
{
    public class PassThroughHandler<T> : SqlMapper.TypeHandler<T>
    {
        private readonly NpgsqlDbType _dbType;

        public PassThroughHandler(NpgsqlDbType dbType)
        {
            _dbType = dbType;
        }

        public override void SetValue(IDbDataParameter parameter, T value)
        {
            parameter.Value = value;
            parameter.DbType = DbType.Object;
            if (parameter is NpgsqlParameter npgsqlParam)
            {
                npgsqlParam.NpgsqlDbType = _dbType;
            }
        }

        public override T Parse(object value)
        {
            if (value == null || value == DBNull.Value)
            {
                return default(T);
            }

            if (!(value is T))
            {
                throw new ArgumentException($"Unable to convert {value.GetType().FullName} to {typeof(T).FullName}",
                    nameof(value));
            }

            return (T)value;
        }
    }
}
