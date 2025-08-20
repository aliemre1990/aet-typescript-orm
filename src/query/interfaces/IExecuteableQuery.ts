import { DbType } from "../../db.js";
import type { QueryTablesObjectType } from "../../table/types/utils.js";
import type { ColumnsToResultMap, TablesToResultMap, TResultShape } from "../types/result.js";

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