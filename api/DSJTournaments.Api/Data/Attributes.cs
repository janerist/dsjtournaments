using System;

namespace DSJTournaments.Api.Data;

internal class TableNameAttribute : Attribute
{
    public string TableName { get; }

    public TableNameAttribute(string tableName)
    {
        TableName = tableName;
    }
}

internal class WriteAttribute : Attribute
{
    public bool Write { get; set; }

    public WriteAttribute(bool write)
    {
        Write = write;
    }
}

internal class KeyAttribute : Attribute
{
}