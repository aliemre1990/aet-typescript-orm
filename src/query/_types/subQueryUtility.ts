import type { DbType } from "../../db.js";
import type { MapToQueryColumns } from "../../table/table.js";
import type Table from "../../table/table.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type { IDbType } from "../_interfaces/IDbType.js";
import type { IExecuteableQuery } from "../_interfaces/IExecuteableQuery.js";
import type QueryParam from "../param.js";
import type QueryColumn from "../queryColumn.js";
import type QueryTable from "../queryTable.js";
import type { ResultShape } from "./result.js";

type MapSubQueryComparables<TAs extends string, TResult extends readonly any[]> =
    TResult extends readonly [infer First, ...infer Rest] ?
    First extends IComparable<infer TDbType, infer TId, infer TParams, infer TValueType, infer TFinalValueType, any, infer TDefaultFieldKey, infer TColAs> ?
    Rest extends readonly any[] ?
    [IComparable<TDbType, `${TAs}-${TColAs extends undefined ? TDefaultFieldKey : TAs}-${TId}`, TParams, TValueType, TFinalValueType, false, TColAs extends undefined ? TDefaultFieldKey : TColAs, undefined>, ...MapSubQueryComparables<TAs, Rest>] :
    [IComparable<TDbType, `${TAs}-${TColAs extends undefined ? TDefaultFieldKey : TAs}-${TId}`, TParams, TValueType, TFinalValueType, false, TColAs extends undefined ? TDefaultFieldKey : TColAs, undefined>] :
    never :
    []
    ;

type ConvertComparableIdsOfSelectResult<
    TDbType extends DbType,
    T extends IExecuteableQuery<TDbType, any, any, any, any, any, any, any>
> =
    T extends IExecuteableQuery<TDbType, infer TFrom, infer TJoinSpecs, infer TResult, infer TParams, infer TGroupedColumns, infer TOrderBySpecs, infer TAs extends string> ?
    TResult extends undefined ?
    never :
    TResult extends ResultShape<TDbType> ?
    IExecuteableQuery<
        TDbType,
        TFrom,
        TJoinSpecs,
        MapSubQueryComparables<TAs, TResult>,
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
        IExecuteableQuery<TDbType, any, any, any, any, any, any, any>
    )[]
> = TFrom extends readonly [infer First, ...infer Rest] ?
    First extends IExecuteableQuery<TDbType, any, any, any, any, any, any, any> ?
    Rest extends readonly (
        QueryTable<TDbType, any, any, any, any, any> |
        IExecuteableQuery<TDbType, any, any, any, any, any, any, any>
    )[] ?
    [ConvertComparableIdsOfSelectResult<TDbType, First>, ...SetComparableIdsOfSubQueries<TDbType, Rest>] :
    [ConvertComparableIdsOfSelectResult<TDbType, First>] :
    Rest extends readonly (
        QueryTable<TDbType, any, any, any, any, any> |
        IExecuteableQuery<TDbType, any, any, any, any, any, any, any>
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
    [QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, MapToQueryColumns<TDbType, TDbType, TColumns>>, ...ConvertTablesToQueryTables<Rest>] :
    First extends QueryTable<any, any, any, any, any, any> ?
    [First, ...ConvertTablesToQueryTables<Rest>] :
    First extends IExecuteableQuery<any, any, any, any, any, any, any, any> ?
    [First, ...ConvertTablesToQueryTables<Rest>] :
    ConvertTablesToQueryTables<Rest> :
    [];

type AccumulateSubQueryParams<
    TDbType extends DbType,
    TFrom extends readonly any[],
    TParams extends QueryParam<TDbType, any, any, any, any, any>[] | undefined = undefined
> =
    TFrom extends readonly [infer First, ...infer Rest] ?
    First extends IExecuteableQuery<TDbType, any, any, any, infer TInnerParams, any, any, any> ?
    Rest extends any[] ?
    [...(TParams extends undefined ? [] : TParams), ...(TInnerParams extends undefined ? [] : TInnerParams), ...AccumulateSubQueryParams<TDbType, Rest>] :
    [...(TParams extends undefined ? [] : TParams), ...(TInnerParams extends undefined ? [] : TInnerParams)] :
    Rest extends any[] ?
    [...(TParams extends undefined ? [] : TParams), ...AccumulateSubQueryParams<TDbType, Rest>] :
    [] :
    []

export type {
    InferDbTypeFromFromFirstIDbType,
    ConvertTablesToQueryTables,
    SetComparableIdsOfSubQueries,
    AccumulateSubQueryParams,
    ConvertComparableIdsOfSelectResult
}