import { DbType, type DbValueTypes } from "../../db.js";
import type { ColumnsToResultMap, QueryParamsToObject, TResultShape } from "../_types/result.js";
import type QueryParam from "../param.js";
import type QueryColumn from "../queryColumn.js";
import type { ColumnsSelection } from "../queryColumn.js";
import type { GroupBySpecs } from "./IGroupByClause.js";
import type { OrderBySpecs } from "./IOrderByClause.js";

interface IExecuteableQuery<
    TDbType extends DbType,
    TResult extends TResultShape<TDbType> | undefined = undefined,
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null>[] | undefined = undefined,
    TGroupedColumns extends GroupBySpecs<TDbType> | undefined = undefined,
    TOrderBySpecs extends OrderBySpecs<TDbType> | undefined = undefined
> {
    exec: (params?: QueryParamsToObject<TParams>) =>
        TResult extends TResultShape<TDbType> ?
        ColumnsToResultMap<TDbType, TResult> :
        never
}

export type {
    IExecuteableQuery
}