import type { DbType } from "../../db.js";
import type Table from "../../table/table.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type { IDbType } from "../_interfaces/IDbType.js";
import type { IExecuteableQuery } from "../_interfaces/IExecuteableQuery.js";
import type QueryParam from "../param.js";
import type QueryColumn from "../queryColumn.js";
import type QueryTable from "../queryTable.js";
import type { TResultShape } from "./result.js";

type ConvertComparableIdsOfSelectResult<
    TDbType extends DbType,
    T extends IExecuteableQuery<TDbType, any, any, any, any, any, any>
> =
    T extends IExecuteableQuery<TDbType, infer TQueryItems, infer TResult, infer TParams, infer TGroupedColumns, infer TOrderBySpecs, infer TAs> ?
    TResult extends undefined ?
    never :
    TResult extends (infer TItem extends TResultShape<TDbType>)[] ?
    IExecuteableQuery<
        TDbType,
        TQueryItems,
        {
            [K in Extract<keyof TItem, string>]: TItem[K] extends IComparable<TDbType, infer TId, infer TParams, infer TValueType, infer TFinalValueType, any, infer TColAs> ?
            IComparable<TDbType, `${TAs}-${K}-${TId}`, TParams, TValueType, TFinalValueType, false, TColAs> :
            never
        },
        TParams,
        TGroupedColumns,
        TOrderBySpecs,
        TAs
    > :
    TResult extends TResultShape<TDbType> ?
    IExecuteableQuery<
        TDbType,
        TQueryItems,
        {
            [K in Extract<keyof TResult, string>]: TResult[K] extends IComparable<TDbType, infer TId, infer TParams, infer TValueType, infer TFinalValueType, any, infer TColAs> ?
            IComparable<TDbType, `${TAs}-${K}-${TId}`, TParams, TValueType, TFinalValueType, false, TColAs> :
            never
        },
        TParams,
        TGroupedColumns,
        TOrderBySpecs,
        TAs
    > :
    never :
    never;

type SetComparableIdsOfSubQueries<
    TDbType extends DbType,
    TFrom extends readonly (
        QueryTable<TDbType, any, any, any, any, any> |
        IExecuteableQuery<TDbType, any, any, any, any, any, any>
    )[]
> = TFrom extends readonly [infer First, ...infer Rest] ?
    First extends IExecuteableQuery<TDbType, any, any, any, any, any, any> ?
    Rest extends readonly (
        QueryTable<TDbType, any, any, any, any, any> |
        IExecuteableQuery<TDbType, any, any, any, any, any, any>
    )[] ?
    [ConvertComparableIdsOfSelectResult<TDbType, First>, ...SetComparableIdsOfSubQueries<TDbType, Rest>] :
    [ConvertComparableIdsOfSelectResult<TDbType, First>] :
    Rest extends readonly (
        QueryTable<TDbType, any, any, any, any, any> |
        IExecuteableQuery<TDbType, any, any, any, any, any, any>
    )[] ?
    [First, ...SetComparableIdsOfSubQueries<TDbType, Rest>] :
    [First] :
    []
    ;


type InferDbTypeFromFromFirstIDbType<TFrom> =
    TFrom extends IDbType<infer TDbType> ? TDbType :
    TFrom extends readonly [infer First, ...any] ?
    First extends IDbType<infer TDbType> ? TDbType :
    never :
    never;

type ConvertTablesToQueryTables<TFrom> =
    TFrom extends readonly [infer First, ...infer Rest] ?
    First extends Table<infer TDbType, infer TColumns, infer TTableName> ?
    [QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, { [K in keyof TColumns]: QueryColumn<TDbType, TColumns[K], { tableName: TTableName }, undefined> }, undefined>, ...ConvertTablesToQueryTables<Rest>] :
    First extends QueryTable<any, any, any, any, any, any> ?
    [First, ...ConvertTablesToQueryTables<Rest>] :
    First extends IExecuteableQuery<any, any, any, any, any, any, any> ?
    [First, ...ConvertTablesToQueryTables<Rest>] :
    ConvertTablesToQueryTables<Rest> :
    [];

type AccumulateSubQueryParams<
    TDbType extends DbType,
    TFrom extends readonly (
        QueryTable<TDbType, any, any, any, any, any> |
        IExecuteableQuery<TDbType, any, any, any, any, any, any>
    )[]
> =
    TFrom extends readonly [infer First, ...infer Rest] ?
    First extends IExecuteableQuery<TDbType, any, any, infer TParams, any, any, any> ?
    Rest extends readonly (
        QueryTable<TDbType, any, any, any, any, any> |
        IExecuteableQuery<TDbType, any, any, any, any, any, any>
    )[] ?
    [...(TParams extends undefined ? [] : TParams), ...AccumulateSubQueryParams<TDbType, Rest>] :
    [...(TParams extends undefined ? [] : TParams)] :
    Rest extends readonly (
        QueryTable<TDbType, any, any, any, any, any> |
        IExecuteableQuery<TDbType, any, any, any, any, any, any>
    )[] ?
    [...AccumulateSubQueryParams<TDbType, Rest>] :
    [] :
    []

export type {
    InferDbTypeFromFromFirstIDbType,
    ConvertTablesToQueryTables,
    SetComparableIdsOfSubQueries,
    AccumulateSubQueryParams
}