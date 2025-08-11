import { DbType, PgDbType } from "../../db.js";
import { PgColumnType } from "../../postgresql/dataTypes.js";
import { Column, type ColumnsObjectType, type ColumnType, type QueryColumn, type QueryTableSpecsType, type TableType } from "../../table.js";

interface IExecuteableQuery<
    TDbType extends DbType,
    TResult extends { [key: string]: QueryColumn<TDbType, ColumnType<TDbType>, QueryTableSpecsType, string | undefined> | Record<PropertyKey, QueryColumn<TDbType, ColumnType<TDbType>, QueryTableSpecsType, string | undefined>> } | null = null
> {
    exec: () => { [K in keyof TResult as K]: number }
}

export type {
    IExecuteableQuery
}