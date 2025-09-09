import type { DbType, DbValueTypes, PgDbType } from "../../../db.js";
import type { PgValueTypes } from "../../../postgresql/dataTypes.js";
import type { DeepPrettify, UnionToTuple } from "../../../utility/common.js";
import type AggregatedColumn from "../../aggregation/_aggregatedColumn.js";
import type { IComparable } from "../../comparisons/_interfaces/IComparable.js";
import type { QueryParamMedian } from "../../queryColumn.js";
import type QueryColumn from "../../queryColumn.js";
import type ColumnSQLFunction from "../_functions.js";
import type { JSONBuildObjectParam } from "../jsonBuildObject.js";

type InferFirstTypeFromArgs<TDbType extends DbType, TArgs extends
    (
        QueryParamMedian<any> |
        DbValueTypes |
        IComparable<TDbType, any, any, any, any, any>
    )[]
> =
    TArgs extends readonly [infer First, ...infer Rest] ?
    First extends QueryParamMedian<any> ?

    Rest extends (QueryParamMedian<any> | DbValueTypes | IComparable<TDbType, any, any, any, any, any>)[] ?
    InferFirstTypeFromArgs<TDbType, Rest> :
    TDbType extends PgDbType ? PgValueTypes : never :

    First extends string ? string :
    First extends string[] ? string[] :
    First extends number ? number :
    First extends number[] ? number[] :
    First extends bigint ? bigint :
    First extends bigint[] ? bigint[] :
    First extends boolean ? boolean :
    First extends boolean[] ? boolean[] :
    First extends Date ? Date :
    First extends Date[] ? Date[] :
    First extends Buffer ? Buffer :
    First extends object[] ? object[] :

    First extends IComparable<TDbType, any, infer TValType, any, any, any> ? TValType :

    First extends object ? object :
    Rest extends (QueryParamMedian<any> | DbValueTypes | IComparable<TDbType, any, any, any, any, any>)[] ?
    InferFirstTypeFromArgs<TDbType, Rest> :
    TDbType extends PgDbType ? PgValueTypes : never :
    TDbType extends PgDbType ? PgValueTypes : never
    ;

type IsContainsNonNull<TDbType extends DbType, TArgs extends
    (
        QueryParamMedian<any> |
        DbValueTypes |
        IComparable<TDbType, any, any, any, any, any>
    )[]
> = TArgs extends readonly [infer First, ...infer Rest] ?

    First extends QueryParamMedian<any> ?
    Rest extends (QueryParamMedian<any> | DbValueTypes | IComparable<TDbType, any, any, any, any, any>)[] ?
    IsContainsNonNull<TDbType, Rest> :
    false :

    First extends IComparable<TDbType, any, any, infer TFinalType, any, any> ?
    null extends TFinalType ?
    Rest extends (QueryParamMedian<any> | DbValueTypes | IComparable<TDbType, any, any, any, any, any>)[] ?
    IsContainsNonNull<TDbType, Rest> :
    false :
    true :

    null extends First ?
    Rest extends (QueryParamMedian<any> | DbValueTypes | IComparable<TDbType, any, any, any, any, any>)[] ?
    IsContainsNonNull<TDbType, Rest> :
    false :
    true :

    false
    ;

/**
 * 
 */
type InferReturnTypeFromJSONBuildObjectParam<TDbType extends DbType, TObj extends JSONBuildObjectParam<TDbType>> =
    DeepPrettify<{
        [K in keyof TObj]:
        TObj[K] extends IComparable<TDbType, any, any, infer TFinalType, any, any> ? TFinalType :
        TObj[K] extends AggregatedColumn<TDbType, infer TQC> ? TQC extends IComparable<TDbType, any, any, infer TFinalType, any, any> ? TFinalType : never :
        TObj[K] extends JSONBuildObjectParam<TDbType> ? InferReturnTypeFromJSONBuildObjectParam<TDbType, TObj[K]> :
        never
    }>

/**
 * 
 */
type InferIsAggFromJSONFn<TDbType extends DbType, TObj extends JSONBuildObjectParam<TDbType>> =
    UnionToTuple<TObj[keyof TObj]> extends readonly [infer FirstKey, ...infer RestKeys] ?
    FirstKey extends AggregatedColumn<TDbType, any> ? true :
    FirstKey extends JSONBuildObjectParam<TDbType> ? InferIsAggFromJSONFn<TDbType, FirstKey> :
    InferIsAggFromJSONFnKeys<TDbType, RestKeys> :
    false;

type InferIsAggFromJSONFnKeys<TDbType extends DbType, TRestKeys extends readonly any[]> =
    TRestKeys extends readonly [infer FirstKey, ...infer RestKeys] ?
    FirstKey extends AggregatedColumn<TDbType, any> ? true :
    FirstKey extends JSONBuildObjectParam<TDbType> ? InferIsAggFromJSONFn<TDbType, FirstKey> :
    InferIsAggFromJSONFnKeys<TDbType, RestKeys> :
    false;



export type {
    InferFirstTypeFromArgs,
    IsContainsNonNull,
    InferIsAggFromJSONFn,
    InferReturnTypeFromJSONBuildObjectParam
}