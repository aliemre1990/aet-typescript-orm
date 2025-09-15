import type { UnionToTuple } from "../../utility/common.js";
import type AggregatedColumn from "../aggregation/_aggregatedColumn.js";
import type GroupedColumn from "../aggregation/_groupedColumn.js";
import type { ColumnsSelection } from "../queryColumn.js";
import type QueryColumn from "../queryColumn.js";
import type QueryTable from "../queryTable.js";

//
type SpreadGroupedColumns<TGroupedColumns extends readonly (ColumnsSelection<any, any> | QueryColumn<any, any, any, any>)[]> =
    TGroupedColumns extends readonly [infer First, ...infer Rest] ?
    First extends QueryColumn<any, any, any, any> ?
    Rest extends (ColumnsSelection<any, any> | QueryColumn<any, any, any, any>)[] ?
    [First, ...SpreadGroupedColumns<Rest>] :
    [First] :
    First extends ColumnsSelection<any, any> ?
    Rest extends (ColumnsSelection<any, any> | QueryColumn<any, any, any, any>)[] ?
    [...SpreadGroupedTable<First>, ...SpreadGroupedColumns<Rest>] :
    [...SpreadGroupedTable<First>] :
    [] : [];

type SpreadGroupedTable<TGroupedTable extends ColumnsSelection<any, any>> =
    UnionToTuple<TGroupedTable[Extract<keyof TGroupedTable,string>]>

//
type IsGroupedColumnsContains<TGroupedColumns extends QueryColumn<any, any, any, any>[], TQueryColumnToCheck extends QueryColumn<any, any, any, any>> =
    TGroupedColumns extends [infer First, ...infer Rest] ?
    First extends QueryColumn<any, infer TCol1, any, any> ?
    TQueryColumnToCheck extends QueryColumn<any, infer TCol2, any, any> ?
    TCol1 extends TCol2 ?
    TCol2 extends TCol1 ?
    true :
    Rest extends QueryColumn<any, any, any, any>[] ?
    IsGroupedColumnsContains<Rest, TQueryColumnToCheck> :
    false :
    Rest extends QueryColumn<any, any, any, any>[] ?
    IsGroupedColumnsContains<Rest, TQueryColumnToCheck> :
    false :
    false :
    false :
    false;

//
type TablesToColumnsMapFormatGroupedColumns<
    TTables extends readonly QueryTable<any, any, any, any, any, any>[],
    TGroupedColumns extends (ColumnsSelection<any, any> | QueryColumn<any, any, any, any>)[] | undefined
> =
    TGroupedColumns extends undefined ?
    undefined :
    {
        [T in TTables[number]as T["asName"] extends undefined ? T["table"]["name"] : T["asName"] & string]: {
            [
            Kc in keyof T["columns"]as
            T["columns"][Kc]["asName"] extends undefined ?
            T["columns"][Kc]["column"]["name"] : T["columns"][Kc]["asName"] & string
            ]:
            TGroupedColumns extends (ColumnsSelection<any, any> | QueryColumn<any, any, any, any>)[] ?
            IsGroupedColumnsContains<SpreadGroupedColumns<TGroupedColumns>, T["columns"][Kc]> extends true ?
            T["columns"][Kc] extends QueryColumn<infer TDbType, infer TColumn, infer TQTableSpecs, infer TAsName> ?
            GroupedColumn<TDbType, TColumn, TQTableSpecs, TAsName> :
            never :
            AggregatedColumn<T["columns"][Kc] extends QueryColumn<infer TDbType, any, any, any> ? TDbType : never, T["columns"][Kc]> :
            never

        }
    }

export type {
    TablesToColumnsMapFormatGroupedColumns,
    SpreadGroupedColumns,
    IsGroupedColumnsContains
}