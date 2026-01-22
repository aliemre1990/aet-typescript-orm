import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type { DeepPrettify, IsAny, RecordToTupleSafe } from "../../utility/common.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type QueryParam from "../param.js";
import type { JSONBuildObjectParam } from "../functions/jsonFunctions/jsonBuildObject.js";

type InferFirstTypeFromArgs<TDbType extends DbType, TArgs extends
    (
        IComparable<TDbType, any, any, any, any, any, any> |
        DbValueTypes
    )[]
> =
    TArgs extends readonly [infer First, ...infer Rest] ?
    First extends QueryParam<TDbType, string, infer TValueType, any, any, any> ?

    IsAny<TValueType> extends true ?

    Rest extends (IComparable<TDbType, any, any, any, any, any, any> | DbValueTypes)[] ?
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

    First extends IComparable<TDbType, any, infer TValType, any, any, any, any> ? TValType :

    First extends object[] ? First :
    First extends object ? First :
    Rest extends (IComparable<TDbType, any, any, any, any, any, any> | DbValueTypes)[] ?
    InferFirstTypeFromArgs<TDbType, Rest> :
    DbValueTypes :
    DbValueTypes
    ;

type IsContainsNonNull<TDbType extends DbType, TArgs extends
    (
        DbValueTypes |
        null |
        IComparable<TDbType, any, any, any, any, any, any>

    )[]
> = TArgs extends readonly [infer First, ...infer Rest] ?

    First extends IComparable<TDbType, any, any, infer TFinalType, any, any, any> ?
    null extends TFinalType ?
    Rest extends (IComparable<TDbType, any, any, any, any, any, any> | DbValueTypes)[] ?
    IsContainsNonNull<TDbType, Rest> :
    false :
    true :

    null extends First ?
    Rest extends (IComparable<TDbType, any, any, any, any, any, any> | DbValueTypes)[] ?
    IsContainsNonNull<TDbType, Rest> :
    false :
    true :

    false
    ;

type IsContainsNull<TDbType extends DbType, TArgs extends
    (
        DbValueTypes |
        null |
        IComparable<TDbType, any, any, any, any, any, any>

    )[]
> = TArgs extends readonly [infer First, ...infer Rest] ?

    First extends IComparable<TDbType, any, any, infer TFinalType, any, any, any> ?
    null extends TFinalType ?
    true :
    Rest extends (IComparable<TDbType, any, any, any, any, any, any> | DbValueTypes | null)[] ?
    IsContainsNull<TDbType, Rest> :
    false :

    null extends First ?
    true :
    Rest extends (IComparable<TDbType, any, any, any, any, any, any> | DbValueTypes)[] ?
    IsContainsNull<TDbType, Rest> :
    false :

    false
    ;

/**
 * 
 */
type InferReturnTypeFromJSONBuildObjectParam<TDbType extends DbType, TObj extends JSONBuildObjectParam<TDbType>> =
    DeepPrettify<{
        [K in keyof TObj as K extends string ? K : never]:
        TObj[K] extends IComparable<TDbType, any, any, infer TFinalType, any, any, any> ? TFinalType :
        TObj[K] extends JSONBuildObjectParam<TDbType> ? InferReturnTypeFromJSONBuildObjectParam<TDbType, TObj[K]> :
        never
    }>

export type {
    InferFirstTypeFromArgs,
    IsContainsNonNull,
    IsContainsNull,
    InferReturnTypeFromJSONBuildObjectParam
}