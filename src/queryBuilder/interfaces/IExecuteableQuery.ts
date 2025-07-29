import { DbType, PgDbType } from "../../db.js";
import { PgColumnType } from "../../postgresql/dataTypes.js";
import { Column, type ColumnsObjectType, type ColumnType, type TableType } from "../../table.js";

interface IExecuteableQuery<
    TDbType extends DbType,
    TResult extends { [key: string]: ColumnType<TDbType> | Record<PropertyKey, ColumnType<TDbType>> } | null = null
> {
    exec: () => { [K in keyof TResult as K]: number }
}

export type {
    IExecuteableQuery
}