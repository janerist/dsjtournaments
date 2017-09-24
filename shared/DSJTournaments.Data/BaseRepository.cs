using System;
using System.Threading.Tasks;

namespace DSJTournaments.Data
{
    public abstract class BaseRepository
    {
        protected readonly Database Db;

        protected BaseRepository(Database db)
        {
            Db = db;
        }

        public Task<T> Insert<T>(T entity, bool includePrimaryKey = false)
        {
            return Db.Insert<T, int>(entity, includePrimaryKey);
        }

        public async Task<T> Update<T>(T entity, Action<T> updateAction)
        {
            await Db.Update<T, int>(entity, updateAction);
            return entity;
        }

        public async Task<T> Update<T>(int id, T entity)
        {
            await Db.Update<T>(id, entity);
            return entity;
        }
    }
}