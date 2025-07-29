import { PgColumnType } from "./postgresql/dataTypes.js";
import { QueryBuilder } from "./queryBuilder/queryBuilder.js";
import { Column, ColumnsObjectType, ForeignKey, Table } from "./table.js";

type PgDbType = 'postgresql';
type DbType = PgDbType;

class DbObjectProvider<TDbType extends DbType> {
    constructor(public dbType: TDbType) { }

    createTable<
        TTableName extends string,
        TColumns extends ColumnsObjectType<TDbType>
    >(
        name: TTableName,
        columns: TColumns,
        primaryKeys?: (string[])[],
        uniqueKeys?: (string[])[],
        foreignKeys?: ForeignKey[]
    ) {
        return new Table(name, columns, primaryKeys, uniqueKeys, foreignKeys);
    }

}

export type {
    PgDbType,
    DbType
}

export {
    DbObjectProvider
}