import type { DbType } from "../../db.js";
import type { RecordToTupleSafe } from "../../utility/common.js";
import type { GroupBySpecs } from "../_interfaces/IGroupByClause.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type QueryTable from "../queryTable.js";
import type { IExecuteableQuery } from "../_interfaces/IExecuteableQuery.js";
import type ColumnSQLFunction from "../functions/_functions.js";
import type ColumnsSelection from "../columnsSelection.js";
import type { FromType, JoinSpecsType } from "../queryBuilder.js";

//
type SpreadGroupedColumns<TDbType extends DbType, TGroupedColumns extends GroupBySpecs<TDbType>> =
    TGroupedColumns extends readonly [infer First, ...infer Rest] ?
    First extends IComparable<TDbType, any, any, any, any, any, any, any> ?
    Rest extends GroupBySpecs<TDbType> ?
    [First, ...SpreadGroupedColumns<TDbType, Rest>] :
    [First] :
    First extends ColumnsSelection<any, any, any> ?
    Rest extends GroupBySpecs<TDbType> ?
    [...SpreadGroupedTable<First>, ...SpreadGroupedColumns<TDbType, Rest>] :
    [...SpreadGroupedTable<First>] :
    [] : [];

type SpreadGroupedTable<TGroupedTable extends ColumnsSelection<any, any, any>> =
    RecordToTupleSafe<TGroupedTable, string>

//
type IsGroupedColumnsContains<TDbType extends DbType, TGroupedColumns extends IComparable<TDbType, any, any, any, any, false, any, any>[], TComparableToCheck extends IComparable<any, any, any, any, any, any, any, any>> =
    TGroupedColumns extends [infer First, ...infer Rest] ?
    First extends IComparable<TDbType, infer TId, any, any, any, any, any, any> ?
    TComparableToCheck extends IComparable<TDbType, infer TIdToCheck, any, any, any, any, any, any> ?
    TId extends TIdToCheck ?
    TIdToCheck extends TId ?
    true :
    Rest extends IComparable<TDbType, any, any, any, any, any, any, any>[] ?
    IsGroupedColumnsContains<TDbType, Rest, TComparableToCheck> :
    false :
    Rest extends IComparable<TDbType, any, any, any, any, any, any, any>[] ?
    IsGroupedColumnsContains<TDbType, Rest, TComparableToCheck> :
    false :
    false :
    false :
    false;

type GetFunctionsFromGroupBySpecs<TDbType extends DbType, TGroupedColumns extends GroupBySpecs<TDbType> | undefined> =
    TGroupedColumns extends undefined ? [] :

    TGroupedColumns extends readonly [infer First, ...infer Rest] ?
    First extends ColumnSQLFunction<TDbType, any, any, any, any, string, any, any> ?
    Rest extends readonly any[] ?
    [First, ...GetFunctionsFromGroupBySpecs<TDbType, Rest>] :
    [First] :
    Rest extends readonly any[] ?
    [...GetFunctionsFromGroupBySpecs<TDbType, Rest>] :
    [] :
    [];

type MapGroupedColumns<TDbType extends DbType, TGroupedColumns extends GroupBySpecs<TDbType>, TResult extends readonly any[]> =
    TResult extends readonly [infer First, ...infer Rest] ?
    First extends IComparable<infer TInnerDbType extends TDbType, infer TId, infer TParams, infer TValueType, infer TFinalValueType, any, infer TDefaultFieldKey, infer TAs> ?

    IsGroupedColumnsContains<TDbType, SpreadGroupedColumns<TDbType, TGroupedColumns>, First> extends true ?
    Rest extends readonly any[] ?
    [IComparable<TInnerDbType, TId, TParams, TValueType, TFinalValueType, false, TDefaultFieldKey, TAs>, ...MapGroupedColumns<TDbType, TGroupedColumns, Rest>] :
    [IComparable<TInnerDbType, TId, TParams, TValueType, TFinalValueType, false, TDefaultFieldKey, TAs>] :
    Rest extends readonly any[] ?
    [IComparable<TInnerDbType, TId, TParams, TValueType, TFinalValueType, true, TDefaultFieldKey, TAs>, ...MapGroupedColumns<TDbType, TGroupedColumns, Rest>] :
    [IComparable<TInnerDbType, TId, TParams, TValueType, TFinalValueType, true, TDefaultFieldKey, TAs>] :
    [] :
    []
    ;

//
type GroupedTablesToColumnsMap<
    TDbType extends DbType,
    TFrom extends FromType<TDbType>,
    TInnerJoinSpecs extends JoinSpecsType<TDbType> | undefined,
    TGroupedColumns extends GroupBySpecs<TDbType> | undefined
> =
    TGroupedColumns extends undefined ?
    undefined :
    {
        [
        T in TFrom[number]as
        T extends QueryTable<TDbType, any, any, any, any, infer TAs> ?
        TAs extends undefined ? T["table"]["name"] :
        TAs & string :
        T extends IExecuteableQuery<TDbType, any, any, any, any, any, infer TAs> ?
        TAs extends undefined ? never :
        TAs & string :
        never
        ]:
        ColumnsSelection<
            TDbType,
            T,
            TGroupedColumns extends GroupBySpecs<TDbType> ?
            MapGroupedColumns<
                TDbType,
                TGroupedColumns,
                (
                    T extends QueryTable<TDbType, any, any, any, any, any> ? T["columnsList"] :
                    T extends IExecuteableQuery<TDbType, any, any, infer TResult, any, any, any> ?
                    TResult extends undefined ? never :
                    TResult :
                    never
                )
            > : never

        >
    }
    & (
        TInnerJoinSpecs extends undefined ? {} :
        TInnerJoinSpecs extends JoinSpecsType<TDbType> ?
        {
            [
            T in TInnerJoinSpecs[number]as T["table"] extends QueryTable<TDbType, any, any, any, any, any> ?
            T["table"]["asName"] extends undefined ?
            T["table"]["table"]["name"] : T["table"]["asName"] & string :
            T extends IExecuteableQuery<TDbType, any, any, any, any, any, infer TAs> ?
            TAs extends undefined ? never : TAs & string :
            never
            ]:

            ColumnsSelection<
                TDbType,
                T["table"],
                TGroupedColumns extends GroupBySpecs<TDbType> ?
                MapGroupedColumns<
                    TDbType,
                    TGroupedColumns,
                    (
                        T["table"] extends QueryTable<TDbType, any, any, any, any, any> ? T["table"]["columnsList"] :
                        T["table"] extends IExecuteableQuery<TDbType, any, any, infer TResult, any, any, any> ?
                        TResult extends undefined ? never :
                        TResult :
                        never
                    )
                > : never

            >
        }
        : never
    )
    & (
        GetFunctionsFromGroupBySpecs<TDbType, TGroupedColumns>["length"] extends 0 ? {} :
        {
            ["__grouping_functions__"]: {
                [Fn in GetFunctionsFromGroupBySpecs<TDbType, TGroupedColumns>[number]as Fn extends IComparable<TDbType, any, any, any, any, any, any, infer TAs extends string> ? TAs : never]: Fn
            }
        }

    )

export type {
    GroupedTablesToColumnsMap,
    SpreadGroupedColumns,
    IsGroupedColumnsContains
}