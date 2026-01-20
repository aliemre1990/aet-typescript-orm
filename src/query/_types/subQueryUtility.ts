import type { DbType } from "../../db.js";
import type { MapToQueryColumns } from "../../table/table.js";
import type Table from "../../table/table.js";
import type { IDbType } from "../_interfaces/IDbType.js";
import type CTEObject from "../cteObject.js";
import type QueryParam from "../param.js";
import type { FromType, ResultShape } from "../queryBuilder.js";
import type QueryBuilder from "../queryBuilder.js";
import type QueryTable from "../queryTable.js";
import type { MapResultToSubQueryEntry } from "../subQueryObject.js";
import type SubQueryObject from "../subQueryObject.js";

type MapToSubQueryObject<TDbType extends DbType, T> =
    T extends QueryBuilder<TDbType, any, any, any, infer TRes extends ResultShape<TDbType>, any, infer TAs extends string, any> ?
    SubQueryObject<TDbType, T, MapResultToSubQueryEntry<TDbType, TRes>, TAs> : never
    ;

type InferDbTypeFromFromFirstIDbType<TFrom> =
    TFrom extends IDbType<infer TDbType> ? TDbType :
    TFrom extends readonly [infer First, ...any] ?
    First extends IDbType<infer TDbType> ? TDbType :
    never :
    never;

type ConvertElementsToSubQueryCompliant<TDbType extends DbType, TFrom> =
    TFrom extends readonly [infer First, ...infer Rest] ?
    First extends Table<infer TDbType, infer TColumns, infer TTableName> ?
    [QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, MapToQueryColumns<TDbType, TDbType, TColumns>>, ...ConvertElementsToSubQueryCompliant<TDbType, Rest>] :
    First extends QueryTable<TDbType, any, any, any, any, any> ?
    [First, ...ConvertElementsToSubQueryCompliant<TDbType, Rest>] :
    First extends QueryBuilder<TDbType, any, any, any, any, any, any, any> ?
    [MapToSubQueryObject<TDbType, First>, ...ConvertElementsToSubQueryCompliant<TDbType, Rest>] :
    First extends CTEObject<TDbType, any, any, any, any, any> ?
    [First, ...ConvertElementsToSubQueryCompliant<TDbType, Rest>] :
    ConvertElementsToSubQueryCompliant<TDbType, Rest> :
    [];

type AccumulateSubQueryParams<
    TDbType extends DbType,
    TFrom extends FromType<TDbType>,
    TParams extends readonly QueryParam<TDbType, any, any, any, any, any>[] | undefined = undefined
> =
    TFrom extends readonly [infer First, ...infer Rest] ?
    First extends SubQueryObject<TDbType, infer TQb, any, any> ?
    TQb extends QueryBuilder<TDbType, any, any, any, any, infer TInnerParams, any, any> ?
    Rest extends FromType<TDbType> ?
    [...(TParams extends undefined ? [] : TParams), ...(TInnerParams extends undefined ? [] : TInnerParams), ...AccumulateSubQueryParams<TDbType, Rest>] :
    [...(TParams extends undefined ? [] : TParams), ...(TInnerParams extends undefined ? [] : TInnerParams)] :
    Rest extends FromType<TDbType> ?
    [...(TParams extends undefined ? [] : TParams), ...AccumulateSubQueryParams<TDbType, Rest>] :
    [...(TParams extends undefined ? [] : TParams)] :
    Rest extends FromType<TDbType> ?
    [...(TParams extends undefined ? [] : TParams), ...AccumulateSubQueryParams<TDbType, Rest>] :
    [...(TParams extends undefined ? [] : TParams)] :
    [...(TParams extends undefined ? [] : TParams)];



export type {
    InferDbTypeFromFromFirstIDbType,
    ConvertElementsToSubQueryCompliant,
    AccumulateSubQueryParams,
    MapToSubQueryObject
}