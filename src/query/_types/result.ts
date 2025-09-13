import type { DbType } from "../../db.js";
import type QueryColumn from "../queryColumn.js";
import type { ColumnType, QueryTableSpecsType } from "../../table/types/utils.js";
import type { IsPlural, ToSingular } from "../../utility/string.js";
import type { DeepPrettify, FlattenObject } from "../../utility/common.js";
import { QueryParam } from "../queryColumn.js";
import type ColumnComparisonOperation from "../comparisons/_comparisonOperations.js";
import type ColumnLogicalOperation from "../logicalOperations.js";
import type QueryTable from "../queryTable.js";
import type GroupedColumn from "../aggregation/_groupedColumn.js";
import type { IsGroupedColumnsContains, SpreadGroupedColumns } from "./grouping.js";
import type ColumnSQLFunction from "../functions/_functions.js";
import type { IComparable } from "../comparisons/_interfaces/IComparable.js";
import type Column from "../../table/column.js";

type TResultShape<TDbType extends DbType> = {
    [key: string]: IComparable<TDbType, any, any, any, false>;
};


//
type TablesToResultMap<TDbType extends DbType, TTables extends readonly QueryTable<TDbType, any, any, any, any, any>[]> =
    TTables extends undefined ? undefined :
    TTables["length"] extends 0 ? undefined :
    TTables["length"] extends 1 ?
    FlattenObject<{
        [
        T in TTables[number]as
        T extends QueryTable<TDbType, any, any, any, any, any> ?
        T["asName"] extends undefined ? T["table"]["name"] : T["asName"] & string
        : never
        ]:
        {
            [C in keyof T["columns"]as T["columns"][C]["column"]["name"]]:
            T["columns"][C]["column"] extends Column<TDbType, any, any, any, any, any, infer TFinalValueType> ? TFinalValueType : never;
        }

    }> :
    FlattenObject<{
        [
        T in TTables[number]as
        T extends QueryTable<TDbType, any, any, any, any, any> ?
        T["asName"] extends undefined ? T["table"]["name"] : T["asName"] & string
        : never
        ]:
        {
            [
            C in keyof T["columns"]as
            `${IsPlural<(T["asName"] extends undefined ? T["table"]["name"] : T["asName"]) & string> extends true ?
            ToSingular<(T["asName"] extends undefined ? T["table"]["name"] : T["asName"]) & string> :
            (T["asName"] extends undefined ? T["table"]["name"] : T["asName"]) & string}${Capitalize<T["columns"][C]["column"]["name"]>}`]:
            T["columns"][C]["column"] extends Column<TDbType, any, any, any, any, any, infer TFinalValueType> ? TFinalValueType : never;
        }
    }>;

//    
type TablesToGroupedResultMap<
    TDbType extends DbType,
    TTables extends readonly QueryTable<TDbType, any, any, any, any, any>[],
    TGroupedColumns extends ({ [key: string]: QueryColumn<any, any, any, any> } | QueryColumn<any, any, any, any>)[] | undefined
> =
    TTables extends undefined ? undefined :
    TTables["length"] extends 0 ? undefined :
    TTables["length"] extends 1 ?
    FlattenObject<{
        [
        T in TTables[number]as
        T["asName"] extends undefined ? T["table"]["name"] : T["asName"] & string
        ]:
        {
            [
            C in keyof T["columns"]as
            TGroupedColumns extends ({ [key: string]: QueryColumn<any, any, any, any> } | QueryColumn<any, any, any, any>)[] ?
            IsGroupedColumnsContains<SpreadGroupedColumns<TGroupedColumns>, T["columns"][C]> extends true ?
            T["columns"][C]["column"]["name"] :
            never :
            never
            ]:
            T["columns"][C]["column"] extends Column<TDbType, any, any, any, any, any, infer TFinalValueType> ? TFinalValueType : never;
        }

    }> :
    FlattenObject<{
        [
        T in TTables[number]as
        T["asName"] extends undefined ? T["table"]["name"] : T["asName"] & string
        ]:
        {
            [
            C in keyof T["columns"]as
            TGroupedColumns extends ({ [key: string]: QueryColumn<any, any, any, any> } | QueryColumn<any, any, any, any>)[] ?
            IsGroupedColumnsContains<SpreadGroupedColumns<TGroupedColumns>, T["columns"][C]> extends true ?
            `${IsPlural<(T["asName"] extends undefined ? T["table"]["name"] : T["asName"]) & string> extends true ?
            ToSingular<(T["asName"] extends undefined ? T["table"]["name"] : T["asName"]) & string> :
            (T["asName"] extends undefined ? T["table"]["name"] : T["asName"]) & string}${Capitalize<T["columns"][C]["column"]["name"]>}`
            : never
            : never
            ]:
            T["columns"][C]["column"] extends Column<TDbType, any, any, any, any, any, infer TFinalValueType> ? TFinalValueType : never;
        }
    }>;


//
type ColumnsToResultMap<TDbType extends DbType, T extends TResultShape<TDbType> | undefined> =
    T extends undefined ? undefined :
    DeepPrettify<{
        [K in keyof T as T[K] extends IComparable<TDbType, any, any, any, any> ? K : never]:
        T[K] extends IComparable<TDbType, any, any, infer TFinalType, any> ? TFinalType :
        never
    }
    >

// Convert array of QueryParam to object type
type QueryParamsToObject<T extends readonly QueryParam<any, any, any>[] | undefined> = T extends undefined ?
    undefined :
    T extends readonly QueryParam<any, any, any>[] ? {
        [K in T[number]as K extends QueryParam<any, infer Name, any> ? Name : never]:
        K extends QueryParam<any, any, infer ValueType> ? ValueType : never
    } : undefined;


//
type InferParamsFromOps<T> =
    T extends ColumnComparisonOperation<any, infer TComparing, infer TApplied, any> ?
    TComparing extends IComparable<any, any, any, any, any> ? TApplied extends IComparable<any, any, any, any, any>[] ?
    [...InferParamsFromComparables<[TComparing]>, ...InferParamsFromComparables<TApplied>,] :
    [...InferParamsFromComparables<[TComparing]>] :
    TApplied extends readonly IComparable<any, any, any, any, any>[] ?
    [...InferParamsFromComparables<TApplied>] :
    [] :
    T extends ColumnLogicalOperation<any, infer TOps> ?
    InferParamsFromOpsArray<TOps> :
    [];

type InferParamsFromOpsArray<T extends readonly any[]> =
    T extends readonly [infer First, ...infer Rest] ?
    First extends ColumnComparisonOperation<any, infer TComparing, infer TApplied, any> ?
     TComparing extends IComparable<any, any, any, any, any> ? TApplied extends IComparable<any, any, any, any, any>[] ?
    [...InferParamsFromComparables<[TComparing]>,  ...InferParamsFromComparables<TApplied>, ...InferParamsFromOpsArray<Rest>] :
    [...InferParamsFromComparables<[TComparing]>,  ...InferParamsFromOpsArray<Rest>] :

    TApplied extends IComparable<any, any, any, any, any>[] ?
    [...InferParamsFromComparables<TApplied>, ...InferParamsFromOpsArray<Rest>] :

    InferParamsFromOpsArray<Rest> :
    First extends ColumnLogicalOperation<any, infer TOps> ?
    [...InferParamsFromOpsArray<TOps>, ...InferParamsFromOpsArray<Rest>] :
    InferParamsFromOpsArray<Rest> :
    [];

type InferParamsFromComparables<T> =
    T extends readonly [infer First, ...infer Rest] ?
    First extends IComparable<any, infer TParams, any, any, any> ?
    [...(TParams extends QueryParam<any, any, any>[] ? TParams : []), ...InferParamsFromComparables<Rest>] :
    [...InferParamsFromComparables<Rest>] :
    [];



/**
 * 
 */
type AccumulateParams<TParams extends readonly QueryParam<any, any, any>[] | undefined, TCbResult extends ColumnComparisonOperation<any, any, any, any> | ColumnLogicalOperation<any, any>> =
    TParams extends undefined ?
    InferParamsFromOps<TCbResult>["length"] extends 0 ? undefined : InferParamsFromOps<TCbResult> :
    TParams extends QueryParam<any, any, any>[] ? [...TParams, ...InferParamsFromOps<TCbResult>] :
    never;

/**
 * 
 */
// type AccumulateColumnParams<TDbType extends DbType,TParams extends QueryParam<any,any,any>[]|undefined,TResult extends TResultShape<TDbType> >= {}

export type {
    TResultShape,
    TablesToResultMap,
    ColumnsToResultMap,
    QueryParamsToObject,
    InferParamsFromOps,
    AccumulateParams,
    TablesToGroupedResultMap
}