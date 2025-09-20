import { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type { ColumnsToResultMap, QueryParamsToObject, TResultShape } from "../_types/result.js";
import type QueryParam from "../param.js";
import type QueryTable from "../queryTable.js";
import type { GroupBySpecs } from "./IGroupByClause.js";
import type { OrderBySpecs } from "./IOrderByClause.js";

interface IExecuteableQuery<
    TDbType extends DbType,
    TTables extends readonly QueryTable<TDbType, any, any, any, any, any>[],
    TResult extends TResultShape<TDbType>[] | TResultShape<TDbType> | undefined = undefined,
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null>[] | undefined = undefined,
    TGroupedColumns extends GroupBySpecs<TDbType> | undefined = undefined,
    TOrderBySpecs extends OrderBySpecs<TDbType> | undefined = undefined
> {
    exec: (params?: QueryParamsToObject<TParams>) =>
        TResult extends TResultShape<TDbType>[] | TResultShape<TDbType> ?
        ColumnsToResultMap<TDbType, TResult> :
        never
}

export type {
    IExecuteableQuery
}