import { DbType } from "../../db.js";
import type { PgValueTypes } from "../../postgresql/dataTypes.js";
import type { QueryParam } from "../../table/queryColumn.js";
import type { QueryTablesObjectType } from "../../table/types/utils.js";
import type { ColumnsToResultMap, QueryParamsToObject, TablesToResultMap, TResultShape } from "../types/result.js";

interface IExecuteableQuery<
    TDbType extends DbType,
    TTables extends QueryTablesObjectType<TDbType>,
    TResult extends TResultShape<TDbType> | undefined = undefined,
    TParams extends QueryParam<TDbType, string, PgValueTypes>[] | undefined = undefined
> {
    exec: (params?: QueryParamsToObject<TParams>) => TResult extends undefined ? TablesToResultMap<TDbType, TTables> : ColumnsToResultMap<TDbType, TResult>
}

export type {
    IExecuteableQuery
}