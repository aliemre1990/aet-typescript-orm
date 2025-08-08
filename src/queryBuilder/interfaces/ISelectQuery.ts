import { DbType, PgDbType } from "../../db.js";
import { PgColumnType } from "../../postgresql/dataTypes.js";
import type { ColumnType, TablesObjectType } from "../../table.js";
import type { TableToColumnsMap } from "../../types.js";
import { IExecuteableQuery } from "./IExecuteableQuery.js";

interface ISelectQuery<
    TDbType extends DbType,
    TTables extends TablesObjectType<TDbType>
> {
    select<TSelectResult extends { [key: string]: ColumnType<TDbType> | Record<PropertyKey, ColumnType<TDbType>> }>(
        cb: (cols: TableToColumnsMap<TTables>) => TSelectResult): IExecuteableQuery<TDbType, TSelectResult>
}

export type {
    ISelectQuery
}