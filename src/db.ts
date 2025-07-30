import { PgColumnType } from "./postgresql/dataTypes.js";
import { QueryBuilder } from "./queryBuilder/queryBuilder.js";
import { Column, ColumnsObjectType, ForeignKey, Table } from "./table.js";

type PgDbType = 'postgresql';
type DbType = PgDbType;


export type {
    PgDbType,
    DbType
}
