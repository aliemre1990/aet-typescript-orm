import { DbType, type DbValueTypes, type PgDbType } from "../../db.js";
import type { PgValueTypes } from "../../postgresql/dataTypes.js";
import type { QueryParam } from "../queryColumn.js";
import type { ColumnsToResultMap, QueryParamsToObject, TablesToGroupedResultMap, TablesToResultMap, TResultShape } from "../_types/result.js";
import type QueryTable from "../queryTable.js";
import type QueryColumn from "../queryColumn.js";

interface IExecuteableQuery<
    TDbType extends DbType,
    TResult extends TResultShape<TDbType> | undefined = undefined,
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null>[] | undefined = undefined,
> {
    exec: (params?: QueryParamsToObject<TParams>) =>
        TResult extends TResultShape<TDbType> ?
        ColumnsToResultMap<TDbType, TResult> :
        never
}

export type {
    IExecuteableQuery
}