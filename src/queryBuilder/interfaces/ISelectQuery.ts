import { DbType } from "../../db.js";
import { type QueryTablesObjectType, type TableToColumnsMap, type TResultShape } from "../../table.js";
import { IExecuteableQuery } from "./IExecuteableQuery.js";

interface ISelectQuery<
    TDbType extends DbType,
    TTables extends QueryTablesObjectType<TDbType>
> {
    select<
        TSelectResult extends TResultShape<TDbType>
    >(
        cb: (cols: TableToColumnsMap<TTables>) => TSelectResult): IExecuteableQuery<TDbType, TTables, TSelectResult>
}

export type {
    ISelectQuery
}