using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace DSJTournaments.Data
{
    public class QueryBuilder<T>
    {
        private readonly Database _database;
        private readonly string _alias;

        private string _cte;

        private bool _distinct;

        private int? _limit;
        private int? _offset;

        private readonly DynamicParameters _parameters = new DynamicParameters();

        private IEnumerable<string> _fromClauses = Enumerable.Empty<string>();
        private IEnumerable<string> _selectClauses = Enumerable.Empty<string>();
        private IEnumerable<string> _whereClauses = Enumerable.Empty<string>();
        private IEnumerable<string> _joinClauses = Enumerable.Empty<string>();
        private IEnumerable<string> _groupByClauses = Enumerable.Empty<string>();
        private IEnumerable<string> _orderByClauses = Enumerable.Empty<string>();

        public QueryBuilder(Database database, string alias)
        {
            _database = database;
            _alias = alias;
        }

        public QueryBuilder<T> CommonTableExpression(string cte)
        {
            _cte = cte;
            return this;
        }

        public QueryBuilder<T> Select(string select, bool onlyIf = true)
        {
            if (!onlyIf)
                return this;

            return Select(new[] {select});
        }

        public QueryBuilder<T> Select(params string[] selects)
        {
            _selectClauses = _selectClauses.Concat(selects);
            return this;
        }

        public QueryBuilder<T> Select<T2>(QueryBuilder<T2> subQuery,
            string alias = "sub", bool onlyIf = true)
        {
            if (!onlyIf)
                return this;

            Select($"({subQuery.Sql()}) {alias}");
            Params(subQuery._parameters);

            return this;
        }

        public QueryBuilder<T> SelectDistinct(string select, bool onlyIf = true)
        {
            if (!onlyIf)
                return this;

            _distinct = true;
            return Select(select);
        }

        public QueryBuilder<T> SelectDistinct(params string[] selects)
        {
            _distinct = true;
            return Select(selects);
        }

        public QueryBuilder<T> From(string from, bool onlyIf = true)
        {
            if (!onlyIf)
                return this;

            return From(new[] {from});
        }

        public QueryBuilder<T> From(params string[] froms)
        {
            _fromClauses = _fromClauses.Concat(froms);
            return this;
        }

        public QueryBuilder<T> From<T2>(QueryBuilder<T2> subQuery,
            string alias = "sub", bool onlyIf = true)
        {
            if (!onlyIf)
                return this;

            From(new[] {$"({subQuery.Sql()}) {alias}"});
            Params(subQuery._parameters);

            return this;
        }

        public QueryBuilder<T> Join(string joinClause, dynamic param = null, bool onlyIf = true)
        {
            if (!onlyIf)
                return this;

            Join(new[] {joinClause});

            if (param != null)
                Params((object) param);

            return this;
        }

        public QueryBuilder<T> Join(params string[] joins)
        {
            _joinClauses = _joinClauses.Concat(joins.Select(j => "JOIN " + j)).Distinct();
            return this;
        }

        public QueryBuilder<T> OuterJoin(string joinClause, dynamic param = null, bool onlyIf = true)
        {
            if (!onlyIf)
                return this;

            OuterJoin(new[] {joinClause});

            if (param != null)
                Params((object) param);

            return this;
        }

        public QueryBuilder<T> OuterJoin(params string[] outerJoins)
        {
            _joinClauses = _joinClauses.Concat(outerJoins.Select(j => "LEFT OUTER JOIN " + j)).Distinct();
            return this;
        }

        public QueryBuilder<T> Where(string whereClause, dynamic param = null, bool onlyIf = true)
        {
            return Filter(whereClause, (object) param, onlyIf);
        }

        public QueryBuilder<T> Where(params string[] wheres)
        {
            return Filter(wheres);
        }

        public QueryBuilder<T> Filter(string whereClause, dynamic param = null, bool onlyIf = true)
        {
            if (!onlyIf)
                return this;

            Filter(new[] {whereClause});

            if (param != null)
                Params((object) param);

            return this;
        }

        public QueryBuilder<T> Filter(params string[] wheres)
        {
            _whereClauses = _whereClauses.Concat(wheres.Select(w => $"({w})"));
            return this;
        }

        public QueryBuilder<T> GroupBy(string groupByClause, dynamic param = null, bool onlyIf = true)
        {
            if (!onlyIf)
                return this;

            if (param != null)
                Params((object)param);

            return GroupBy(new[] {groupByClause});
        }

        public QueryBuilder<T> GroupBy(params string[] groupBys)
        {
            _groupByClauses = _groupByClauses.Concat(groupBys);
            return this;
        }

        public QueryBuilder<T> OrderBy(string orderBy, bool onlyIf = true)
        {
            if (!onlyIf)
                return this;

            return OrderBy(new[] {orderBy});
        }

        public QueryBuilder<T> OrderBy(params string[] orderBys)
        {
            _orderByClauses = _orderByClauses.Concat(orderBys);
            return this;
        }

        public QueryBuilder<T> Offset(int offset)
        {
            _offset = offset;
            return this;
        }

        public QueryBuilder<T> Limit(int limit)
        {
            _limit = limit;
            return this;
        }

        public QueryBuilder<T> Params(dynamic param, bool onlyIf = true)
        {
            if (!onlyIf)
                return this;

            _parameters.AddDynamicParams((object) param);
            return this;
        }

        private string ConstructFromClause()
        {
            var tableName = _database.GetTableName<T>();

            if (!_fromClauses.Any())
            {
                return tableName + (_alias != null ? " " + _alias : string.Empty);
            }

            return string.Join(", ", _fromClauses);
        }

        private string ConstructSelectClause()
        {
            if (!_selectClauses.Any())
                return "*";

            return string.Join(", ", _selectClauses);
        }

        private string ConstructJoinClauses()
        {
            if (!_joinClauses.Any())
                return string.Empty;

            return string.Join(" ", _joinClauses);
        }

        private string ConstructWhereClause()
        {
            if (!_whereClauses.Any())
                return string.Empty;

            return "WHERE " + string.Join(" AND ", _whereClauses);
        }

        private string ConstructOrderByClause()
        {
            if (!_orderByClauses.Any())
                return string.Empty;

            return "ORDER BY " + string.Join(", ", _orderByClauses);
        }

        private string ConstructGroupByClause()
        {
            if (!_groupByClauses.Any())
                return string.Empty;

            return "GROUP BY " + string.Join(", ", _groupByClauses);
        }

        private string Sql()
        {
            return GenerateQuery(
                _cte,
                _distinct,
                ConstructSelectClause(),
                ConstructFromClause(),
                ConstructJoinClauses(),
                ConstructWhereClause(),
                ConstructGroupByClause(),
                ConstructOrderByClause(),
                _offset,
                _limit);
        }

        private string CountSql()
        {
            return $@"SELECT COUNT(*) FROM ({GenerateQuery(
                _cte,
                _distinct,
                ConstructSelectClause(),
                ConstructFromClause(),
                ConstructJoinClauses(),
                ConstructWhereClause(),
                ConstructGroupByClause(),
                string.Empty,
                null,
                null)}) agg";
        }

        private static string GenerateQuery(string cte, bool distinct, string selectClause, string fromClause,
            string joinClause, string whereClause, string groupByClause, string orderByClause, int? offset, int? limit)
        {
            var sb = new StringBuilder();
            sb.AppendFormat("{0}SELECT{1} {2} FROM {3}",
                cte != null ? cte + " " : string.Empty,
                distinct ? " DISTINCT" : string.Empty,
                selectClause,
                fromClause);

            if (joinClause != string.Empty)
            {
                sb.Append(" " + joinClause);
            }

            if (whereClause != string.Empty)
            {
                sb.Append(" " + whereClause);
            }

            if (groupByClause != string.Empty)
            {
                sb.Append(" " + groupByClause);
            }

            if (orderByClause != string.Empty)
            {
                sb.Append(" " + orderByClause);
            }

            if (offset != null)
            {
                sb.AppendFormat(" OFFSET {0}", offset);
            }

            if (limit != null)
            {
                sb.AppendFormat(" LIMIT {0}", limit);
            }

            return sb.ToString();
        }

        public T FirstOrDefault()
        {
            return _database.QueryFirstOrDefault<T>(Sql(), _parameters);
        }

        public Task<T> FirstOrDefaultAsync()
        {
            return _database.QueryFirstOrDefaultAsync<T>(Sql(), _parameters);
        }

        public T First()
        {
            return _database.QueryFirst<T>(Sql(), _parameters);
        }

        public Task<T> FirstAsync()
        {
            return _database.QueryFirstAsync<T>(Sql(), _parameters);
        }

        public T[] All()
        {
            return _database.Query<T>(Sql(), _parameters);
        }

        public Task<T[]> AllAsync()
        {
            return _database.QueryAsync<T>(Sql(), _parameters);
        }

        public T[] Page(int page, int pageSize)
        {
            _limit = pageSize;
            _offset = (page - 1) * pageSize;

            return All();
        }

        public Task<T[]> PageAsync(int page, int pageSize)
        {
            _limit = pageSize;
            _offset = (page - 1)*pageSize;

            return AllAsync();
        }

        public (T[], int) PageAndCount(int page, int pageSize)
        {
            _limit = pageSize;
            _offset = (page - 1) * pageSize;
            if (_offset == 0)
                _offset = null;

            var countSql = CountSql();
            var pageSql = Sql();
            var sql = countSql + ";" + pageSql + ";";

            int count = 0;
            IEnumerable<T> results = null;

            _database.QueryMultiple(sql, _parameters, gridReader =>
            {
                IDictionary<string, object> dapperRow = gridReader.Read().Single();
                count = Convert.ToInt32(dapperRow.Values.First());
                results = gridReader.Read<T>().ToList();
            });

            return (results.ToArray(), count);
        }

        public async Task<(T[], int)> PageAndCountAsync(int page, int pageSize)
        {
            _limit = pageSize;
            _offset = (page - 1)*pageSize;
            if (_offset == 0)
                _offset = null;

            var countSql = CountSql();
            var pageSql = Sql();
            var sql = countSql + ";" + pageSql + ";";

            int count = 0;
            IEnumerable<T> results = null;

            await _database.QueryMultipleAsync(sql, _parameters, gridReader =>
            {
                IDictionary<string, object> dapperRow = gridReader.Read().Single();
                count = Convert.ToInt32(dapperRow.Values.First());
                results = gridReader.Read<T>().ToList();
            });

            return (results.ToArray(), count);
        }

        public bool Exists()
        {
            return !Equals(FirstOrDefault(), default(T));
        }

        public async Task<bool> ExistsAsync()
        {
            return !Equals(await FirstOrDefaultAsync(), default(T));
        }

        public int Count()
        {
            IDictionary<string, object> dapperRow = _database.QuerySingle<dynamic>(CountSql(), _parameters);
            var count = dapperRow.Values.First();
            return Convert.ToInt32(count);
        }

        public async Task<int> CountAsync()
        {
            IDictionary<string, object> dapperRow = await _database.QuerySingleAsync<dynamic>(CountSql(), _parameters);
            var count = dapperRow.Values.First();
            return Convert.ToInt32(count);
        }
    }
}
