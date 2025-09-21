import type { DbType, PgDbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type { DeepPrettify, IsAny, UnionToTupleSafe } from "../../utility/common.js";
import type AggregatedColumn from "../aggregation/_aggregatedColumn.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type QueryParam from "../param.js";
import type { JSONBuildObjectParam } from "../functions/jsonFunctions/jsonBuildObject.js";

type InferFirstTypeFromArgs<TDbType extends DbType, TArgs extends
    (
        IComparable<TDbType, any, any, any, any> |
        DbValueTypes
    )[]
> =
    TArgs extends readonly [infer First, ...infer Rest] ?
    First extends QueryParam<TDbType, string, infer TValueType> ?

    IsAny<TValueType> extends true ?

    Rest extends (IComparable<TDbType, any, any, any, any> | DbValueTypes)[] ?
    InferFirstTypeFromArgs<TDbType, Rest> :
    DbValueTypes :

    TValueType :

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

    First extends IComparable<TDbType, any, infer TValType, any, any> ? TValType :

    First extends object[] ? First :
    First extends object ? First :
    Rest extends (IComparable<TDbType, any, any, any, any> | DbValueTypes)[] ?
    InferFirstTypeFromArgs<TDbType, Rest> :
    DbValueTypes :
    DbValueTypes
    ;

type IsContainsNonNull<TDbType extends DbType, TArgs extends
    (
        IComparable<TDbType, any, any, any, any> |
        DbValueTypes

    )[]
> = TArgs extends readonly [infer First, ...infer Rest] ?

    First extends IComparable<TDbType, any, any, infer TFinalType, any> ?
    null extends TFinalType ?
    Rest extends (IComparable<TDbType, any, any, any, any> | DbValueTypes)[] ?
    IsContainsNonNull<TDbType, Rest> :
    false :
    true :

    null extends First ?
    Rest extends (IComparable<TDbType, any, any, any, any> | DbValueTypes)[] ?
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
        [K in keyof TObj as K extends string ? K : never]:
        TObj[K] extends IComparable<TDbType, any, any, infer TFinalType, any> ? TFinalType :
        TObj[K] extends AggregatedColumn<TDbType, infer TQC> ? TQC extends IComparable<TDbType, any, any, infer TFinalType, any> ? TFinalType : never :
        TObj[K] extends JSONBuildObjectParam<TDbType> ? InferReturnTypeFromJSONBuildObjectParam<TDbType, TObj[K]> :
        never
    }>

/**
 * 
 */
type InferIsAggFromJSONFn<TDbType extends DbType, TObj extends JSONBuildObjectParam<TDbType>> =
    UnionToTupleSafe<TObj> extends readonly [infer FirstKey, ...infer RestKeys] ?
    FirstKey extends IComparable<TDbType, any, any, any, true> ? true :
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