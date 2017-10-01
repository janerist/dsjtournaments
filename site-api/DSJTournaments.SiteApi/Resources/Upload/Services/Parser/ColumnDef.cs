using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Reflection;

namespace DSJTournaments.SiteApi.Resources.Upload.Services.Parser
{
    public abstract class ColumnDef<T>
    {
        public List<(PropertyInfo, (int, int), Func<string, object>)> Columns { get; } = 
            new List<(PropertyInfo, (int, int), Func<string, object>)>();

        public void ColumnFor<TValue>(Expression<Func<T, TValue>> propertySelector, (int, int) startAndLength, Func<string, TValue> transform = null)
        {
            var member = propertySelector.Body as MemberExpression;
            var unary = propertySelector.Body as UnaryExpression;
            var propertyInfo = (member ?? unary?.Operand as MemberExpression)?.Member as PropertyInfo;
            if (propertyInfo != null)
            {
                object WrappedTransform(string value) => transform != null ? (object) transform(value) : value;
                Columns.Add((propertyInfo, startAndLength, WrappedTransform));
            }
        }
    }
}