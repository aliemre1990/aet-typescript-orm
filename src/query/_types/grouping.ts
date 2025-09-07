import type { UnionToTuple } from "../../utility/common.js";
import type GroupedColumn from "../aggregation/_groupedColumn.js";
import type QueryColumn from "../queryColumn.js";
import type QueryTable from "../queryTable.js";

//
type SpreadGroupedColumns<TGroupedColumns extends readonly ({ [key: string]: QueryColumn<any, any, any, any> } | QueryColumn<any, any, any, any>)[]> =
    TGroupedColumns extends readonly [infer First, ...infer Rest] ?
    First extends QueryColumn<any, any, any, any> ?
    Rest extends ({ [key: string]: QueryColumn<any, any, any, any> } | QueryColumn<any, any, any, any>)[] ?
    [First, ...SpreadGroupedColumns<Rest>] :
    [First] :
    First extends { [key: string]: QueryColumn<any, any, any, any> } ?
    Rest extends ({ [key: string]: QueryColumn<any, any, any, any> } | QueryColumn<any, any, any, any>)[] ?
    [...SpreadGroupedTable<First>, ...SpreadGroupedColumns<Rest>] :
    [...SpreadGroupedTable<First>] :
    [] : [];

type SpreadGroupedTable<TGroupedTable extends { [key: string]: any }> =
    TGroupedTable extends { [key: string]: QueryColumn<any, any, any, any> } ?
    UnionToTuple<TGroupedTable[keyof TGroupedTable]>
    : [];

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
    TTables extends QueryTable<any, any, any, any, any, any>[],
    TGroupedColumns extends ({ [key: string]: QueryColumn<any, any, any, any> } | QueryColumn<any, any, any, any>)[] | undefined
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
            TGroupedColumns extends ({ [key: string]: QueryColumn<any, any, any, any> } | QueryColumn<any, any, any, any>)[] ?
            IsGroupedColumnsContains<SpreadGroupedColumns<TGroupedColumns>, T["columns"][Kc]> extends true ?
            T["columns"][Kc] extends QueryColumn<infer TDbType, infer TColumn, infer TQTableSpecs, infer TAsName> ?
            GroupedColumn<TDbType, TColumn, TQTableSpecs, TAsName> : never : T["columns"][Kc]
            : T["columns"][Kc]

        }
    }

export type {
    TablesToColumnsMapFormatGroupedColumns,
    SpreadGroupedColumns,
    IsGroupedColumnsContains
}