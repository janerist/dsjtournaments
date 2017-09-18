using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Threading.Tasks;
using Dapper;
using DSJTournaments.Api.Data.TypeHandlers;
using Npgsql;
using NpgsqlTypes;

namespace DSJTournaments.Api.Data
{
    public class Database
    {
        public string ConnectionString { get; }

        static Database()
        {
            DefaultTypeMap.MatchNamesWithUnderscores = true;
            SqlMapper.AddTypeHandler(new PassThroughHandler<IPAddress>(NpgsqlDbType.Inet));
        }

        public Database(string cnnString)
        {
            ConnectionString = cnnString;
        }

        private NpgsqlConnection GetOpenConnection()
        {
            var cnn = new NpgsqlConnection(ConnectionString);
            cnn.Open();
            return cnn;
        }

        private async Task<NpgsqlConnection> GetOpenConnectionAsync()
        {
            var cnn = new NpgsqlConnection(ConnectionString);
            await cnn.OpenAsync();
            return cnn;
        }

        public T[] Query<T>(string sql, object param = null)
        {
            using (var cnn = GetOpenConnection())
            {
                return cnn.Query<T>(new CommandDefinition(sql, param)).ToArray();
            }
        }

        public async Task<T[]> QueryAsync<T>(string sql, object param = null)
        {
            using (var cnn = await GetOpenConnectionAsync())
            {
                return (await cnn.QueryAsync<T>(new CommandDefinition(sql, param))).ToArray();
            }
        }

        public void QueryMultiple(string sql, object param = null, Action<SqlMapper.GridReader> action = null)
        {
            using (var cnn = GetOpenConnection())
            {
                using (var gridReader = cnn.QueryMultiple(sql, param))
                {
                    action?.Invoke(gridReader);
                }
            }
        }

        public async Task QueryMultipleAsync(string sql, object param = null, Action<SqlMapper.GridReader> action = null)
        {
            using (var cnn = await GetOpenConnectionAsync())
            {
                using (var gridReader = await cnn.QueryMultipleAsync(sql, param))
                {
                    action?.Invoke(gridReader);
                }
            }
        }

        public T QueryFirst<T>(string sql, object param = null)
        {
            return Query<T>(sql, param).First();
        }

        public async Task<T> QueryFirstAsync<T>(string sql, object param = null)
        {
            return (await QueryAsync<T>(sql, param)).First();
        }

        public T QueryFirstOrDefault<T>(string sql, object param = null)
        {
            return Query<T>(sql, param).FirstOrDefault();
        }

        public async Task<T> QueryFirstOrDefaultAsync<T>(string sql, object param = null)
        {
            return (await QueryAsync<T>(sql, param)).FirstOrDefault();
        }

        public T QuerySingle<T>(string sql, object param = null)
        {
            return Query<T>(sql, param).Single();
        }

        public async Task<T> QuerySingleAsync<T>(string sql, object param = null)
        {
            return (await QueryAsync<T>(sql, param)).Single();
        }
        
        public T QuerySingleOrDefault<T>(string sql, object param = null)
        {
            return Query<T>(sql, param).SingleOrDefault();
        }

        public async Task<T> QuerySingleOrDefaultAsync<T>(string sql, object param = null)
        {
            return (await QueryAsync<T>(sql, param)).SingleOrDefault();
        }

        public QueryBuilder<T> Query<T>(string alias = null)
        {
            return new QueryBuilder<T>(this, alias);
        }

        public int Execute(string sql, object param = null)
        {
            using (var cnn = GetOpenConnection())
            {
                return cnn.Execute(sql, param);
            }
        }

        public async Task<int> ExecuteAsync(string sql, object param = null)
        {
            using (var cnn = await GetOpenConnectionAsync())
            {
                return await cnn.ExecuteAsync(sql, param);
            }
        }

        public T ExecuteScalar<T>(string sql, object param = null)
        {
            using (var cnn = GetOpenConnection())
            {
                return cnn.ExecuteScalar<T>(sql, param);
            }
        }

        public async Task<T> ExecuteScalarAsync<T>(string sql, object param = null)
        {
            using (var cnn = await GetOpenConnectionAsync())
            {
                return await cnn.ExecuteScalarAsync<T>(sql, param);
            }
        }

        public Task<T> Insert<T>(T entityToInsert, bool includePrimaryKey = false) => Insert<T, int>(entityToInsert, includePrimaryKey);
        public async Task<T> Insert<T, TId>(T entityToInsert, bool includePrimaryKey = false)
        {
            var properties = TypeProperties(typeof(T));
            var keyProperties = includePrimaryKey ? new List<PropertyInfo>() : KeyProperties(typeof(T));
            properties = properties.Except(keyProperties).ToList();

            var cols = string.Join(", ", properties.Select(p => ColumnName(p.Name)));
            var colsParams = string.Join(", ", properties.Select(p => "@" + p.Name));

            var tableName = GetTableName<T>();
            var returning = keyProperties.Any()
                ? " RETURNING " + string.Join(", ", keyProperties.Select(p => ColumnName(p.Name)))
                : string.Empty;

            var sql = $"INSERT INTO {tableName} ({cols}) VALUES ({colsParams}){returning}";

            if (keyProperties.Any())
            {
                TId id = await ExecuteScalarAsync<TId>(sql, entityToInsert);
                entityToInsert.GetType().GetProperty(keyProperties.First().Name).SetValue(entityToInsert, id);
            }
            else
            {
                await ExecuteAsync(sql, entityToInsert);
            }

            return entityToInsert;
        }

        public Task<int> Update<T>(int id, dynamic data) => Update<T, int>(id, data);
        public Task<int> Update<T, TId>(TId id, dynamic data)
        {
            var keyProperty = KeyProperties(typeof(T)).Single();
            var propertyNames = GetPropertyNames((object)data).ToList();

            if (!propertyNames.Any())
                return Task.FromResult(0);

            var sets = string.Join(", ", propertyNames
                .Where(name => name != keyProperty.Name)
                .Select(name => $"{ColumnName(name)} = @{name}"));

            var tableName = GetTableName<T>();
            string sql = $"UPDATE {tableName} SET {sets} WHERE {ColumnName(keyProperty.Name)} = @{keyProperty.Name}";

            var parameters = new DynamicParameters(data);
            parameters.Add(keyProperty.Name, id);

            return ExecuteAsync(sql, parameters);
        }

        public Task<int> Update<T>(T entity, Action<T> updateAction) => Update<T, int>(entity, updateAction);
        public Task<int> Update<T, TId>(T entity, Action<T> updateAction)
        {
            var snapshot = Snapshotter.Start(entity);
            updateAction(entity);

            var keyProperty = KeyProperties(typeof(T)).Single();

            return Update<T, TId>((TId) keyProperty.GetValue(entity), snapshot.Diff());
        }

        public Task<int> Delete<T>(int id) => Delete<T, int>(id);
        public Task<int> Delete<T, TId>(TId id)
        {
            var keyProperty = KeyProperties(typeof(T)).Single();

            string sql = $"DELETE FROM {GetTableName<T>()} WHERE {ColumnName(keyProperty.Name)} = @{keyProperty.Name}";
            var parameters = new DynamicParameters();
            parameters.Add(keyProperty.Name, id);

            return ExecuteAsync(sql, parameters);
        }

        private static readonly ConcurrentDictionary<Type, List<PropertyInfo>> TypePropertyCache = new ConcurrentDictionary<Type, List<PropertyInfo>>();
        private static readonly ConcurrentDictionary<Type, List<PropertyInfo>> KeyPropertyCache = new ConcurrentDictionary<Type, List<PropertyInfo>>();

        private static readonly ConcurrentDictionary<string, string> ColumnNameMap = new ConcurrentDictionary<string, string>();

        public string GetTableName<T>()
        {
            return typeof(T)
                       .GetTypeInfo()
                       .GetCustomAttribute<TableNameAttribute>()?.TableName ?? typeof(T).Name;
        }

        private IEnumerable<string> GetPropertyNames(object data)
        {
            var parameters = data as DynamicParameters;
            if (parameters != null)
            {
                return parameters.ParameterNames;
            }

            return TypeProperties(data.GetType()).Select(x => x.Name);
        }

        private List<PropertyInfo> TypeProperties(Type type)
        {
            List<PropertyInfo> typeProperties;
            if (!TypePropertyCache.TryGetValue(type, out typeProperties))
            {
                typeProperties = type
                        .GetProperties(BindingFlags.GetProperty | BindingFlags.Instance | BindingFlags.Public)
                        .Where(IsWriteable)
                        .ToList();
                TypePropertyCache[type] = typeProperties;

                foreach (var typeProperty in typeProperties)
                {
                    ColumnNameMap[typeProperty.Name] = typeProperty.Name.ToSnakeCase();
                }
            }

            return typeProperties;
        }

        private List<PropertyInfo> KeyProperties(Type type)
        {
            List<PropertyInfo> keyProperties;
            if (!KeyPropertyCache.TryGetValue(type, out keyProperties))
            {
                var typeProperties = TypeProperties(type).ToList();
                keyProperties = typeProperties.Where(arg => arg.GetCustomAttribute<KeyAttribute>() != null).ToList();
                if (!keyProperties.Any())
                {
                    keyProperties = typeProperties.Where(p => p.Name.ToLower() == "id").ToList();
                }

                KeyPropertyCache[type] = keyProperties.ToList();
            }
            return keyProperties;
        }

        private string ColumnName(string name)
        {
            return ColumnNameMap[name];
        }

        private bool IsWriteable(PropertyInfo pi)
        {
            var attr = pi.GetCustomAttribute<WriteAttribute>();
            return attr == null || attr.Write;
        }
    }
}