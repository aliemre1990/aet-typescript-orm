import { DbType, type DbValueTypes, type PgDbType } from "../../db.js";
import type { PgValueTypes } from "../../postgresql/dataTypes.js";
import type { QueryParam } from "../queryColumn.js";
import type { ColumnsToResultMap, QueryParamsToObject, TablesToGroupedResultMap, TablesToResultMap, TResultShape } from "../_types/result.js";
import type QueryTable from "../queryTable.js";
import type QueryColumn from "../queryColumn.js";

interface IExecuteableQuery<
    TDbType extends DbType,
    TTables extends QueryTable<TDbType, any, any, any, any, any>[],
    TResult extends TResultShape<TDbType> | undefined = undefined,
    TParams extends QueryParam<TDbType, string, DbValueTypes | null>[] | undefined = undefined,
    TGroupedColumns extends ({ [key: string]: QueryColumn<TDbType, any, any, any> } | QueryColumn<TDbType, any, any, any>)[] | undefined = undefined,
> {
    exec: (params?: QueryParamsToObject<TParams>) =>
        TResult extends undefined ?
        TGroupedColumns extends undefined ?
        TablesToResultMap<TDbType, TTables> :
        TablesToGroupedResultMap<TDbType, TTables, TGroupedColumns> :
        TResult extends TResultShape<TDbType> ?
        ColumnsToResultMap<TDbType, TResult> :
        never
}

export type {
    IExecuteableQuery
}