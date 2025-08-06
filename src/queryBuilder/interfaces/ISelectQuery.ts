import { DbType, PgDbType } from "../../db.js";
import { PgColumnType } from "../../postgresql/dataTypes.js";
import { Column, Table, TablesObjectType, type ColumnsObjectType, type ColumnType, type QueryColumn, type QueryTablesObjectType, type QueryTableSpecsType, type TableSpecsType, type TableToColumnsMap, type TableType } from "../../table.js";
import { IExecuteableQuery } from "./IExecuteableQuery.js";

interface ISelectQuery<
    TDbType extends DbType,
    TTables extends QueryTablesObjectType<TDbType>
> {
    select<
        TSelectResult extends { [key: string]: QueryColumn<TDbType, ColumnType<TDbType>, QueryTableSpecsType, string | undefined> | Record<PropertyKey, QueryColumn<TDbType, ColumnType<TDbType>, QueryTableSpecsType, string | undefined>> }
    >(
        cb: (cols: TableToColumnsMap<TTables>) => TSelectResult): IExecuteableQuery<TDbType, TSelectResult>
}

export type {
    ISelectQuery
}