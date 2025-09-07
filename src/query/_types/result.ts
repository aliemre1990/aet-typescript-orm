import type { DbType } from "../../db.js";
import type { PgTypeToJsType } from "../../postgresql/dataTypes.js";
import type QueryColumn from "../queryColumn.js";
import type { ColumnType, QueryTablesObjectType, QueryTableSpecsType } from "../../table/types/utils.js";
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

type TResultShape<TDbType extends DbType> = {
    [key: string]: QueryColumn<TDbType, ColumnType<TDbType>, QueryTableSpecsType, string | undefined> | TResultShape<TDbType>;
};

type TGroupedResultShape<TDbType extends DbType> = {
    [key: string]: GroupedColumn<TDbType, QueryColumn<TDbType, ColumnType<TDbType>, QueryTableSpecsType, string | undefined>> | TGroupedResultShape<TDbType>;
};


//
type TablesToResultMap<TDbType extends DbType, TTables extends QueryTable<TDbType, any, any, any, any, any>[]> =
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
            [C in keyof T["columns"]as T["columns"][C]["column"]["name"]]: PgTypeToJsType<T["columns"][C]["column"]["type"]>
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
            PgTypeToJsType<T["columns"][C]["column"]["type"]>
        }
    }>;

//    
type TablesToGroupedResultMap<
    TDbType extends DbType,
    TTables extends QueryTable<TDbType, any, any, any, any, any>[],
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
            ]: PgTypeToJsType<T["columns"][C]["column"]["type"]>
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
            ]: PgTypeToJsType<T["columns"][C]["column"]["type"]>
        }
    }>;


//
type ColumnsToResultMap<TDbType extends DbType, T extends TResultShape<TDbType> | undefined> =
    T extends undefined ? undefined :
    DeepPrettify<{
        [K in keyof T as T[K] extends QueryColumn<TDbType, any, any, any> ?
        T[K]["asName"] extends undefined ? K : T[K]["asName"] & string : never]:
        T[K] extends QueryColumn<TDbType, any, any, any> ? PgTypeToJsType<T[K]["column"]["type"]> : never
    }
        &
    {
        [K in keyof T as T[K] extends { [key: string]: QueryColumn<TDbType, any, infer TTableSpecs, any> } ?
        TTableSpecs extends { asTableName: string } ? TTableSpecs["asTableName"] : K : never]:
        T[K] extends { [key: string]: QueryColumn<TDbType, any, any, any> } ? ColumnsToResultMap<TDbType, T[K]> : never
    }
        &
    {
        [K in keyof T as T[K] extends TResultShape<TDbType> ? K : never]:
        T[K] extends TResultShape<TDbType> ? ColumnsToResultMap<TDbType, T[K]> : never
    }
    >

//
type GroupedColumnsToResultMap<TDbType extends DbType, T extends TGroupedResultShape<TDbType> | undefined> =
    T extends undefined ? undefined :
    DeepPrettify<{
        [K in keyof T as T[K] extends GroupedColumn<TDbType, infer TQColumn> ?
        TQColumn["asName"] extends undefined ? K : TQColumn["asName"] & string : never]:
        T[K] extends GroupedColumn<TDbType, infer TQColumn> ? PgTypeToJsType<TQColumn["column"]["type"]> : never
    }
        &
    {
        [K in keyof T as T[K] extends { [key: string]: GroupedColumn<TDbType, infer TQColumn> } ?
        TQColumn extends QueryColumn<TDbType, any, infer TTableSpecs, any> ?
        TTableSpecs extends { asTableName: string } ? TTableSpecs["asTableName"] : K : never : never]:
        T[K] extends { [key: string]: GroupedColumn<TDbType, any> } ? GroupedColumnsToResultMap<TDbType, T[K]> : never
    }
        &
    {
        [K in keyof T as T[K] extends TGroupedResultShape<TDbType> ? K : never]:
        T[K] extends TGroupedResultShape<TDbType> ? GroupedColumnsToResultMap<TDbType, T[K]> : never
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
    T extends ColumnComparisonOperation<any, infer TFn, infer TApplied, infer TParams> ?
    TParams extends readonly QueryParam<any, any, any>[] ? TFn extends ColumnSQLFunction<any, any, any, any> ? TApplied extends IComparable<any, any, any>[] ?
    [...InferParamsFromComparables<TApplied>, ...InferParamsFromFn<TFn>, ...TParams] :
    [...InferParamsFromFn<TFn>, ...TParams] :
    TParams :
    TFn extends ColumnSQLFunction<any, any, any, any> ? TApplied extends IComparable<any, any, any>[] ?
    [...InferParamsFromComparables<TApplied>, ...InferParamsFromFn<TFn>] :
    [...InferParamsFromFn<TFn>] :
    TApplied extends readonly IComparable<any, any, any>[] ?
    [...InferParamsFromComparables<TApplied>] :
    [] :
    T extends ColumnLogicalOperation<any, infer TOps> ?
    InferParamsFromOpsArray<TOps> :
    [];

type InferParamsFromOpsArray<T extends readonly any[]> =
    T extends readonly [infer First, ...infer Rest] ?
    First extends ColumnComparisonOperation<any, infer TFn, infer TApplied, infer TParams> ?
    TParams extends readonly QueryParam<any, any, any>[] ? TFn extends ColumnSQLFunction<any, any, any, any> ? TApplied extends IComparable<any, any, any>[] ?
    [...TParams, ...InferParamsFromComparables<TApplied>, ...InferParamsFromFn<TFn>, ...InferParamsFromOpsArray<Rest>] :
    [...TParams, ...InferParamsFromFn<TFn>, ...InferParamsFromOpsArray<Rest>] :
    [...TParams, ...InferParamsFromOpsArray<Rest>] :

    TFn extends ColumnSQLFunction<any, any, any, any> ? TApplied extends IComparable<any, any, any>[] ?
    [...InferParamsFromComparables<TApplied>, ...InferParamsFromFn<TFn>, ...InferParamsFromOpsArray<Rest>] :
    [...InferParamsFromFn<TFn>, ...InferParamsFromOpsArray<Rest>] :

    TApplied extends IComparable<any, any, any>[] ?
    [...InferParamsFromComparables<TApplied>, ...InferParamsFromOpsArray<Rest>] :

    InferParamsFromOpsArray<Rest> :
    First extends ColumnLogicalOperation<any, infer TOps> ?
    [...InferParamsFromOpsArray<TOps>, ...InferParamsFromOpsArray<Rest>] :
    InferParamsFromOpsArray<Rest> :
    [];

type InferParamsFromComparables<T> =
    T extends readonly [infer First, ...infer Rest] ?
    First extends IComparable<any, infer TParams, any> ?
    [...(TParams extends QueryParam<any, any, any>[] ? TParams : []), ...InferParamsFromComparables<Rest>] :
    [...InferParamsFromComparables<Rest>] :
    [];

type InferParamsFromFn<T> = T extends ColumnSQLFunction<any, any, infer TArgs, any> ? InferParamsFromFnArgs<TArgs> : never;

type InferParamsFromFnArgs<T> =
    T extends readonly [infer FirstArg, ...infer RestArgs] ?
    FirstArg extends QueryParam<any, any, any> ? [FirstArg, ...InferParamsFromFnArgs<RestArgs>] :
    FirstArg extends ColumnSQLFunction<any, any, any, any> ? [...InferParamsFromFn<FirstArg>, ...InferParamsFromFnArgs<RestArgs>] :
    [...InferParamsFromFnArgs<RestArgs>] :
    [];


//
type AccumulateParams<TParams extends QueryParam<any, any, any>[] | undefined, TCbResult extends ColumnComparisonOperation<any, any, any, any, any> | ColumnLogicalOperation<any, any>> =
    TParams extends undefined ?
    InferParamsFromOps<TCbResult>["length"] extends 0 ? undefined : InferParamsFromOps<TCbResult> :
    TParams extends QueryParam<any, any, any>[] ? [...TParams, ...InferParamsFromOps<TCbResult>] :
    never;

export type {
    TResultShape,
    TablesToResultMap,
    ColumnsToResultMap,
    QueryParamsToObject,
    InferParamsFromOps,
    AccumulateParams,
    TGroupedResultShape,
    GroupedColumnsToResultMap,
    TablesToGroupedResultMap,
    InferParamsFromFn,
    InferParamsFromFnArgs
}