import type { DbType, DbValueTypes, PgDbType } from "../../../db.js";
import type { PgValueTypes } from "../../../postgresql/dataTypes.js";
import type { GetColumnTypeFromDbType } from "../../_types/miscellaneous.js";
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
    
    Rest extends (DbValueTypes | QueryColumn<TDbType, any, any, any> | ColumnSQLFunction<TDbType, any, any, any>)[] ?
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

    First extends QueryColumn<TDbType, infer TCol, any, any> ? GetColumnTypeFromDbType<TDbType, TCol> :

    First extends ColumnSQLFunction<TDbType, any, any, infer TReturnType> ?
    TReturnType extends string ? string :
    TReturnType extends string[] ? string[] :
    TReturnType extends number ? number :
    TReturnType extends number[] ? number[] :
    TReturnType extends bigint ? bigint :
    TReturnType extends bigint[] ? bigint[] :
    TReturnType extends boolean ? boolean :
    TReturnType extends boolean[] ? boolean[] :
    TReturnType extends Date ? Date :
    TReturnType extends Date[] ? Date[] :
    TReturnType extends Buffer ? Buffer :
    TReturnType extends object[] ? object[] :
    TReturnType extends object ? object :
    never :
    First extends object ? object :
    Rest extends (DbValueTypes | QueryColumn<TDbType, any, any, any> | ColumnSQLFunction<TDbType, any, any, any>)[] ?
    InferFirstTypeFromArgs<TDbType, Rest> :
    TDbType extends PgDbType ? PgValueTypes : never :
    TDbType extends PgDbType ? PgValueTypes : never
    ;

export {
    InferFirstTypeFromArgs
}