import type { DbType, DbValueTypes, PgDbType } from "../../../db.js";
import type { PgValueTypes } from "../../../postgresql/dataTypes.js";
import type Column from "../../../table/column.js";
import type { GetColumnTypeFromDbType } from "../../_types/miscellaneous.js";
import type { IComparable } from "../../comparisons/_interfaces/IComparable.js";
import type { QueryParamMedian } from "../../queryColumn.js";
import type QueryColumn from "../../queryColumn.js";
import type ColumnSQLFunction from "../_functions.js";

type InferFirstTypeFromArgs<TDbType extends DbType, TArgs extends
    (
        QueryParamMedian<any> |
        DbValueTypes |
        QueryColumn<TDbType, any, any, any> |
        ColumnSQLFunction<TDbType, any, any, any>
    )[]
> =
    TArgs extends readonly [infer First, ...infer Rest] ?
    First extends QueryParamMedian<any> ?

    Rest extends (QueryParamMedian<any> | DbValueTypes | IComparable<TDbType, any, any, any>)[] ?
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

    First extends IComparable<TDbType, any, infer TValType, any> ? TValType :

    First extends object ? object :
    Rest extends (QueryParamMedian<any> | DbValueTypes | IComparable<TDbType, any, any, any>)[] ?
    InferFirstTypeFromArgs<TDbType, Rest> :
    TDbType extends PgDbType ? PgValueTypes : never :
    TDbType extends PgDbType ? PgValueTypes : never
    ;

type IsContainsNonNull<TDbType extends DbType, TArgs extends
    (
        QueryParamMedian<any> |
        DbValueTypes |
        IComparable<TDbType, any, any, any>
    )[]
> = TArgs extends readonly [infer First, ...infer Rest] ?

    First extends QueryParamMedian<any> ?
    Rest extends (QueryParamMedian<any> | DbValueTypes | IComparable<TDbType, any, any, any>)[] ?
    IsContainsNonNull<TDbType, Rest> :
    false :

    First extends IComparable<TDbType, any, any, infer TFinalType> ?
    null extends TFinalType ?
    Rest extends (QueryParamMedian<any> | DbValueTypes | IComparable<TDbType, any, any, any>)[] ?
    IsContainsNonNull<TDbType, Rest> :
    false :
    true :

    null extends First ?
    Rest extends (QueryParamMedian<any> | DbValueTypes | IComparable<TDbType, any, any, any>)[] ?
    IsContainsNonNull<TDbType, Rest> :
    false :
    true :

    false
    ;

export type {
    InferFirstTypeFromArgs,
    IsContainsNonNull
}