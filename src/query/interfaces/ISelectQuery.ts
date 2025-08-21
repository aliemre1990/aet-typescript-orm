import { DbType } from "../../db.js";
import type { PgValueTypes } from "../../postgresql/dataTypes.js";
import type { QueryParam } from "../../table/queryColumn.js";
import type { QueryTablesObjectType } from "../../table/types/utils.js";
import type { TableToColumnsMap } from "../types/miscellaneous.js";
import type { TResultShape } from "../types/result.js";
import { IExecuteableQuery } from "./IExecuteableQuery.js";

interface ISelectQuery<
    TDbType extends DbType,
    TTables extends QueryTablesObjectType<TDbType>,
    TParams extends QueryParam<TDbType, string, PgValueTypes>[] | undefined = undefined
> {
    select<TCb extends undefined>():
        IExecuteableQuery<TDbType, TTables, TCb extends (cols: any) => infer TR ? TR : undefined, TParams>
    select<
        TCb extends ((cols: TableToColumnsMap<TTables>) => TResultShape<TDbType>)
    >(cb: TCb):
        IExecuteableQuery<TDbType, TTables, TCb extends (cols: any) => infer TR ? TR : undefined, TParams>
    select<
        TCb extends ((cols: TableToColumnsMap<TTables>) => TResultShape<TDbType>)
    >(
        cb?: TCb): IExecuteableQuery<TDbType, TTables, TCb extends (cols: any) => infer TR ? TR : undefined, TParams>
}

export type {
    ISelectQuery
}