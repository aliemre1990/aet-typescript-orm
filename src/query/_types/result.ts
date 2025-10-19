import type { DbType } from "../../db.js";
import type { DeepPrettify } from "../../utility/common.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type ColumnsSelection from "../columnsSelection.js";
import type QueryParam from "../param.js";

type ResultShapeItem<TDbType extends DbType> = IComparable<TDbType, any, any, any, any, any>;
type ResultShape<TDbType extends DbType> = readonly ResultShapeItem<TDbType>[];

type ColumnsToResultMap<TDbType extends DbType, T extends ResultShape<TDbType> | undefined> =
    T extends undefined ? undefined :
    T extends ResultShape<TDbType> ?
    DeepPrettify<ColumnsToResultMapRecursively<TDbType,T>>[] :
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
    ResultShape,
    ResultShapeItem,
    ColumnsToResultMap,
    QueryParamsToObject,
    SelectToResultMapRecursively
}