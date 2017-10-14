﻿using DSJTournaments.Data;
using DSJTournaments.SiteApi.Resources.Jumpers.RequestModels;

namespace DSJTournaments.SiteApi.Resources.Jumpers.Data
{
    public static class JumpersQueryBuilderExtensions
    {
        public static QueryBuilder<T> OrderBy<T>(this QueryBuilder<T> query, JumperSort? sort)
        {
            switch (sort)
            {
                case JumperSort.NameAsc:
                    return query.OrderBy("j.name ASC");

                case JumperSort.NameDesc:
                    return query.OrderBy("j.name DESC");

                case JumperSort.NationAsc:
                    return query.OrderBy("j.nation ASC");

                case JumperSort.NationDesc:
                    return query.OrderBy("j.nation DESC");

                case JumperSort.ParticipationsAsc:
                    return query.OrderBy("participations ASC");

                case JumperSort.ParticipationsDesc:
                    return query.OrderBy("participations DESC");

                default:
                    return query.OrderBy("participations DESC");
            }
        }
    }
}