import type { DbType } from "../../db.js";
import type { DeepPrettify } from "../../utility/common.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type ColumnsSelection from "../ColumnsSelection.js";
import type CTEObject from "../cteObject.js";
import type QueryParam from "../param.js";
import type { ComparisonType, FromType, JoinSpecsType, JoinType, ResultShape } from "../queryBuilder.js";
import type QueryTable from "../queryTable.js";
import type SubQueryObject from "../subQueryObject.js";


type ColumnsToResultMap<TDbType extends DbType, T extends ResultShape<TDbType> | undefined> =
    T extends undefined ? undefined :
    T extends ResultShape<TDbType> ?
    DeepPrettify<ColumnsToResultMapRecursively<TDbType, T>>[] :
    never;

type ColumnsToResultMapRecursively<
    TDbType extends DbType,
    T extends ResultShape<TDbType>,
    Acc extends { [key: string]: any } = {}
> =
    T extends readonly [infer First, ...infer Rest] ?
    First extends IComparable<TDbType, any, any, infer TFinalType, infer TDefaultKey, infer TAs> ?

    TAs extends undefined ?

    Rest extends any[] ?
    ColumnsToResultMapRecursively<TDbType, Rest, Omit<Acc, TDefaultKey> & { [K in TDefaultKey]: TFinalType }> :
    Omit<Acc, TDefaultKey> & { [K in TDefaultKey]: TFinalType } :

    TAs extends string ?

    Rest extends any[] ?
    ColumnsToResultMapRecursively<TDbType, Rest, Omit<Acc, TAs> & { [K in TAs]: TFinalType }> :
    Omit<Acc, TAs> & { [K in TAs]: TFinalType } :

    never :
    never :

    Acc;


type SelectToResultMapRecursively<
    TDbType extends DbType,
    TSelect extends readonly (ColumnsSelection<TDbType, any, any> | IComparable<TDbType, any, any, any, any, any>)[]
> =
    TSelect extends readonly [infer First, ...infer Rest] ?
    First extends IComparable<TDbType, any, any, any, any, any> ?
    Rest extends readonly [any, ...any[]] ?
    [First, ...SelectToResultMapRecursively<TDbType, Rest>] :
    [First] :
    First extends ColumnsSelection<TDbType, any, infer TCols> ?
    Rest extends readonly [any, ...any[]] ?
    [...TCols, ...SelectToResultMapRecursively<TDbType, Rest>] :
    [...TCols] :
    Rest extends readonly [any, ...any[]] ?
    [...SelectToResultMapRecursively<TDbType, Rest>] :
    [] :
    []
    ;

/**
 * Convert empty select callback to columns list
 */
type SelectToAllColumnsMapRecursively<
    TDbType extends DbType,
    TFrom extends FromType<TDbType> | undefined,
    TJoin extends JoinSpecsType<TDbType> | undefined
> =
    [
        ...(TFrom extends FromType<TDbType> ? FromToAllColumnsMapRecursively<TDbType, TFrom> : []),
        ...(TJoin extends JoinSpecsType<TDbType> ? JoinToAllColumnsMapRecursively<TDbType, TJoin> : [])
    ]
    ;

type JoinToAllColumnsMapRecursively<
    TDbType extends DbType,
    TJoin extends JoinSpecsType<TDbType>
> =
    TJoin extends readonly [infer FFirst, ...infer FRest] ?
    FFirst extends { joinType: JoinType, table: infer TTable, comparison: ComparisonType<TDbType> } ?

    TTable extends QueryTable<TDbType, any, any, any, infer TQCols, any> ?
    FRest extends readonly [any, ...any[]] ?
    [...TQCols, ...JoinToAllColumnsMapRecursively<TDbType, FRest>] :
    [...TQCols] :
    TTable extends SubQueryObject<TDbType, any, infer TEntries, any> ?
    FRest extends readonly [any, ...any[]] ?
    [...TEntries, ...JoinToAllColumnsMapRecursively<TDbType, FRest>] :
    [...TEntries] :
    TTable extends CTEObject<TDbType, any, any, any, any, any> ?
    FRest extends readonly [any, ...any[]] ?
    [...TTable["cteObjectEntries"], ...JoinToAllColumnsMapRecursively<TDbType, FRest>] :
    [...TTable["cteObjectEntries"]] :
    never :
    never :
    [];
type FromToAllColumnsMapRecursively<
    TDbType extends DbType,
    TFrom extends FromType<TDbType>
> =
    TFrom extends readonly [infer FFirst, ...infer FRest] ?
    FFirst extends QueryTable<TDbType, any, any, any, infer TQCols, any> ?
    FRest extends readonly [any, ...any[]] ?
    [...TQCols, ...FromToAllColumnsMapRecursively<TDbType, FRest>] :
    [...TQCols] :
    FFirst extends SubQueryObject<TDbType, any, infer TEntries, any> ?
    FRest extends readonly [any, ...any[]] ?
    [...TEntries, ...FromToAllColumnsMapRecursively<TDbType, FRest>] :
    [...TEntries] :
    FFirst extends CTEObject<TDbType, any, any, any, any, any> ?
    FRest extends readonly [any, ...any[]] ?
    [...FFirst["cteObjectEntries"], ...FromToAllColumnsMapRecursively<TDbType, FRest>] :
    [...FFirst["cteObjectEntries"]] :
    never :
    []
    ;

// Convert array of QueryParam to object type
type QueryParamsToObject<T extends readonly QueryParam<any, any, any, any, any>[] | undefined> =
    T extends undefined ? undefined :
    T extends QueryParam<any, any, any, any, any>[] ?
    T["length"] extends 0 ? undefined :
    T extends readonly QueryParam<any, any, any, any, any>[] ? {
        [K in T[number]as K extends QueryParam<any, infer Name, any, any, any> ? Name : never]:
        K extends QueryParam<any, any, infer ValueType, any, any> ? ValueType : never
    }
    : never
    : undefined;

export type {
    ColumnsToResultMap,
    QueryParamsToObject,
    SelectToResultMapRecursively,
    SelectToAllColumnsMapRecursively
}