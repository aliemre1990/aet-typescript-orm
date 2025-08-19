import { DbType, PgDbType } from "../../db.js";
import { PgColumnType } from "../../postgresql/dataTypes.js";
import { Column, type ColumnsObjectType, type ColumnsToResultMap, type ColumnType, type QueryColumn, type QueryTablesObjectType, type QueryTableSpecsType, type TablesToResultMap, type TableType, type TResultShape } from "../../table.js";

interface IExecuteableQuery<
    TDbType extends DbType,
    TTables extends QueryTablesObjectType<TDbType>,
    TResult extends TResultShape<TDbType> | undefined = undefined
> {
    exec: () => TResult extends undefined ? TablesToResultMap<TDbType, TTables> : ColumnsToResultMap<TDbType, TResult>
}

export type {
    IExecuteableQuery
}