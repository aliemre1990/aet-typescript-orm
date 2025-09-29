import type { DbType } from "../../db.js";
import type { DeepPrettify, RecordToTupleSafe } from "../../utility/common.js";
import type ColumnComparisonOperation from "../comparisons/_comparisonOperations.js";
import type ColumnLogicalOperation from "../logicalOperations.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type QueryParam from "../param.js";
import type { OrderBySpecs, OrderType } from "../_interfaces/IOrderByClause.js";

type TResultShape<TDbType extends DbType> = {
    [key: string]: IComparable<TDbType, any, any, any, any, false, any, any>;
};


// //
// type TablesToResultMap<TDbType extends DbType, TTables extends readonly QueryTable<TDbType, any, any, any, any, any>[]> =
//     TTables extends undefined ? undefined :
//     TTables["length"] extends 0 ? undefined :
//     TTables["length"] extends 1 ?
//     FlattenObject<{
//         [
//         T in TTables[number]as
//         T extends QueryTable<TDbType, any, any, any, any, any> ?
//         T["asName"] extends undefined ? T["table"]["name"] : T["asName"] & string
//         : never
//         ]:
//         {
//             [C in keyof T["columns"]as T["columns"][C]["column"]["name"]]:
//             T["columns"][C]["column"] extends Column<TDbType, any, any, any, any, any, infer TFinalValueType> ? TFinalValueType : never;
//         }

//     }> :
//     FlattenObject<{
//         [
//         T in TTables[number]as
//         T extends QueryTable<TDbType, any, any, any, any, any> ?
//         T["asName"] extends undefined ? T["table"]["name"] : T["asName"] & string
//         : never
//         ]:
//         {
//             [
//             C in keyof T["columns"]as
//             `${IsPlural<(T["asName"] extends undefined ? T["table"]["name"] : T["asName"]) & string> extends true ?
//             ToSingular<(T["asName"] extends undefined ? T["table"]["name"] : T["asName"]) & string> :
//             (T["asName"] extends undefined ? T["table"]["name"] : T["asName"]) & string}${Capitalize<T["columns"][C]["column"]["name"]>}`]:
//             T["columns"][C]["column"] extends Column<TDbType, any, any, any, any, any, infer TFinalValueType> ? TFinalValueType : never;
//         }
//     }>;

// //    
// type TablesToGroupedResultMap<
//     TDbType extends DbType,
//     TTables extends readonly QueryTable<TDbType, any, any, any, any, any>[],
//     TGroupedColumns extends ({ [key: string]: QueryColumn<any, any, any, any> } | QueryColumn<any, any, any, any>)[] | undefined
// > =
//     TTables extends undefined ? undefined :
//     TTables["length"] extends 0 ? undefined :
//     TTables["length"] extends 1 ?
//     FlattenObject<{
//         [
//         T in TTables[number]as
//         T["asName"] extends undefined ? T["table"]["name"] : T["asName"] & string
//         ]:
//         {
//             [
//             C in keyof T["columns"]as
//             TGroupedColumns extends ({ [key: string]: QueryColumn<any, any, any, any> } | QueryColumn<any, any, any, any>)[] ?
//             IsGroupedColumnsContains<SpreadGroupedColumns<TGroupedColumns>, T["columns"][C]> extends true ?
//             T["columns"][C]["column"]["name"] :
//             never :
//             never
//             ]:
//             T["columns"][C]["column"] extends Column<TDbType, any, any, any, any, any, infer TFinalValueType> ? TFinalValueType : never;
//         }

//     }> :
//     FlattenObject<{
//         [
//         T in TTables[number]as
//         T["asName"] extends undefined ? T["table"]["name"] : T["asName"] & string
//         ]:
//         {
//             [
//             C in keyof T["columns"]as
//             TGroupedColumns extends ({ [key: string]: QueryColumn<any, any, any, any> } | QueryColumn<any, any, any, any>)[] ?
//             IsGroupedColumnsContains<SpreadGroupedColumns<TGroupedColumns>, T["columns"][C]> extends true ?
//             `${IsPlural<(T["asName"] extends undefined ? T["table"]["name"] : T["asName"]) & string> extends true ?
//             ToSingular<(T["asName"] extends undefined ? T["table"]["name"] : T["asName"]) & string> :
//             (T["asName"] extends undefined ? T["table"]["name"] : T["asName"]) & string}${Capitalize<T["columns"][C]["column"]["name"]>}`
//             : never
//             : never
//             ]:
//             T["columns"][C]["column"] extends Column<TDbType, any, any, any, any, any, infer TFinalValueType> ? TFinalValueType : never;
//         }
//     }>;


//
type ColumnsToResultMap<TDbType extends DbType, T extends TResultShape<TDbType> | undefined> =
    DeepPrettify<
        T extends undefined ? undefined :
        T extends TResultShape<TDbType> ?
        {
            [K in keyof T as T[K] extends IComparable<TDbType, any, any, any, any, any, any, any> ? K : never]:
            T[K] extends IComparable<TDbType, any, any, any, infer TFinalType, any, any, any> ? TFinalType :
            never
        }[] :
        never
    >

// Convert array of QueryParam to object type
type QueryParamsToObject<T extends readonly QueryParam<any, any, any, any, any, any>[] | undefined> =
    T extends undefined ? undefined :
    T extends QueryParam<any, any, any, any, any, any>[] ?
    T["length"] extends 0 ? undefined :
    T extends readonly QueryParam<any, any, any, any, any, any>[] ? {
        [K in T[number]as K extends QueryParam<any, infer Name, any, any, any, any> ? Name : never]:
        K extends QueryParam<any, any, infer ValueType, any, any, any> ? ValueType : never
    }
    : never
    : undefined;


//
type InferParamsFromOps<T> =
    T extends ColumnComparisonOperation<any, infer TComparing, infer TApplied, any> ?
    TComparing extends IComparable<any, any, any, any, any, any, any, any> ? TApplied extends IComparable<any, any, any, any, any, any, any, any>[] ?
    [...InferParamsFromComparables<[TComparing]>, ...InferParamsFromComparables<TApplied>,] :
    [...InferParamsFromComparables<[TComparing]>] :
    TApplied extends readonly IComparable<any, any, any, any, any, any, any, any>[] ?
    [...InferParamsFromComparables<TApplied>] :
    [] :
    T extends ColumnLogicalOperation<any, infer TOps> ?
    InferParamsFromOpsArray<TOps> :
    [];

type InferParamsFromOpsArray<T extends readonly any[]> =
    T extends readonly [infer First, ...infer Rest] ?
    First extends ColumnComparisonOperation<any, infer TComparing, infer TApplied, any> ?
    TComparing extends IComparable<any, any, any, any, any, any, any, any> ? TApplied extends IComparable<any, any, any, any, any, any, any, any>[] ?
    [...InferParamsFromComparables<[TComparing]>, ...InferParamsFromComparables<TApplied>, ...InferParamsFromOpsArray<Rest>] :
    [...InferParamsFromComparables<[TComparing]>, ...InferParamsFromOpsArray<Rest>] :

    TApplied extends IComparable<any, any, any, any, any, any, any, any>[] ?
    [...InferParamsFromComparables<TApplied>, ...InferParamsFromOpsArray<Rest>] :

    InferParamsFromOpsArray<Rest> :
    First extends ColumnLogicalOperation<any, infer TOps> ?
    [...InferParamsFromOpsArray<TOps>, ...InferParamsFromOpsArray<Rest>] :
    InferParamsFromOpsArray<Rest> :
    [];

type InferParamsFromComparables<T> =
    T extends readonly [infer First, ...infer Rest] ?
    First extends IComparable<any, any, infer TParams, any, any, any, any, any> ?
    [...(TParams extends undefined ? [] : TParams), ...InferParamsFromComparables<Rest>] :
    [...InferParamsFromComparables<Rest>] :
    [];



/**
 * 
 */
type AccumulateComparisonParams<TParams extends readonly QueryParam<any, any, any, any, any, any>[] | undefined, TCbResult extends ColumnComparisonOperation<any, any, any, any> | ColumnLogicalOperation<any, any>> =
    TParams extends undefined ?
    InferParamsFromOps<TCbResult>["length"] extends 0 ? undefined : InferParamsFromOps<TCbResult> :
    TParams extends QueryParam<any, any, any, any, any, any>[] ? [...TParams, ...InferParamsFromOps<TCbResult>] :
    never;

/**
 * 
 */
type AccumulateColumnParams<TParams extends readonly QueryParam<any, any, any, any, any, any>[] | undefined, TResult extends TResultShape<DbType>> =
    TParams extends undefined ?
    InferParamsFromColumns<TResult>["length"] extends 0 ? undefined : InferParamsFromColumns<TResult> :
    TParams extends QueryParam<any, any, any, any, any, any>[] ? [...TParams, ...InferParamsFromColumns<TResult>] :
    never;


type InferParamsFromColumns<TResult extends TResultShape<DbType>> =
    RecordToTupleSafe<TResult, string> extends readonly [infer First, ...infer Rest] ?
    First extends IComparable<any, any, infer TParams, any, any, any, any, any> ? [...(TParams extends undefined ? [] : TParams), ...InferParamsFromColumnsArr<Rest>] :
    Rest extends readonly any[] ? InferParamsFromColumnsArr<Rest> :
    [] :
    [];

type InferParamsFromColumnsArr<TCols> =
    TCols extends readonly [infer First, ...infer Rest] ?
    First extends IComparable<any, any, infer TParams, any, any, any, any, any> ? [...(TParams extends undefined ? [] : TParams), ...InferParamsFromColumnsArr<Rest>] :
    Rest extends readonly any[] ? InferParamsFromColumnsArr<Rest> :
    [] :
    [];


/**
 * 
 */
type AccumulateOrderByParams<
    TDbType extends DbType,
    TParams extends readonly QueryParam<any, any, any, any, any, any>[] | undefined,
    TOrderByParams extends OrderBySpecs<TDbType>
> =
    TParams extends undefined ?
    InferParamsFromOrderByParams<TDbType, TOrderByParams>["length"] extends 0 ? undefined : InferParamsFromOrderByParams<TDbType, TOrderByParams> :
    TParams extends QueryParam<any, any, any, any, any, any>[] ? [...TParams, ...InferParamsFromOrderByParams<TDbType, TOrderByParams>] :
    never;

type InferParamsFromOrderByParams<TDbType extends DbType, TOrderByParams extends OrderBySpecs<TDbType>> =
    TOrderByParams extends readonly [infer First, ...infer Rest] ?
    First extends IComparable<TDbType, any, infer TParams, any, any, false, any, any> ? Rest extends OrderBySpecs<TDbType> ?
    [...(TParams extends undefined ? [] : TParams), InferParamsFromOrderByParams<TDbType, Rest>] :
    [...(TParams extends undefined ? [] : TParams)] :
    First extends [IComparable<TDbType, any, infer TParams, any, any, false, any, any>, OrderType] ? Rest extends OrderBySpecs<TDbType> ?
    [...(TParams extends undefined ? [] : TParams), InferParamsFromOrderByParams<TDbType, Rest>] :
    [...(TParams extends undefined ? [] : TParams)] :
    [] :
    [];

export type {
    TResultShape,
    ColumnsToResultMap,
    QueryParamsToObject,
    InferParamsFromOps,
    AccumulateComparisonParams,
    AccumulateColumnParams,
    AccumulateOrderByParams
}