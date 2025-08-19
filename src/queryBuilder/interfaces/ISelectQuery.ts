import { DbType } from "../../db.js";
import { type QueryTablesObjectType, type TableToColumnsMap, type TResultShape } from "../../table.js";
import { IExecuteableQuery } from "./IExecuteableQuery.js";

interface ISelectQuery<
    TDbType extends DbType,
    TTables extends QueryTablesObjectType<TDbType>
> {
    select<TCb extends undefined>():
        IExecuteableQuery<TDbType, TTables, TCb extends (cols: any) => infer TR ? TR : undefined>
    select<
        TCb extends ((cols: TableToColumnsMap<TTables>) => TResultShape<TDbType>)
    >(cb: TCb):
        IExecuteableQuery<TDbType, TTables, TCb extends (cols: any) => infer TR ? TR : undefined>
    select<
        TCb extends ((cols: TableToColumnsMap<TTables>) => TResultShape<TDbType>)
    >(
        cb?: TCb): IExecuteableQuery<TDbType, TTables, TCb extends (cols: any) => infer TR ? TR : undefined>
}

export type {
    ISelectQuery
}