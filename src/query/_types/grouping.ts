import type { DbType } from "../../db.js";
import type { RecordToTupleSafe } from "../../utility/common.js";
import type { GroupBySpecs } from "../_interfaces/IGroupByClause.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type QueryBuilder from "../queryBuilder.js";
import type { ColumnsSelection } from "../queryColumn.js";
import type QueryColumn from "../queryColumn.js";
import type QueryTable from "../queryTable.js";
import type { IExecuteableQuery } from "../_interfaces/IExecuteableQuery.js";

//
type SpreadGroupedColumns<TDbType extends DbType, TGroupedColumns extends GroupBySpecs<TDbType>> =
    TGroupedColumns extends readonly [infer First, ...infer Rest] ?
    First extends QueryColumn<any, any, any, any> ?
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
type IsGroupedColumnsContains<TDbType extends DbType, TGroupedColumns extends IComparable<TDbType, any, any, any, any, false, any>[], TQueryColumnToCheck extends QueryColumn<any, any, any, any>> =
    TGroupedColumns extends [infer First, ...infer Rest] ?
    First extends QueryColumn<any, infer TCol1, any, any> ?
    TQueryColumnToCheck extends QueryColumn<any, infer TCol2, any, any> ?
    TCol1 extends TCol2 ?
    TCol2 extends TCol1 ?
    true :
    Rest extends QueryColumn<any, any, any, any>[] ?
    IsGroupedColumnsContains<TDbType, Rest, TQueryColumnToCheck> :
    false :
    Rest extends QueryColumn<any, any, any, any>[] ?
    IsGroupedColumnsContains<TDbType, Rest, TQueryColumnToCheck> :
    false :
    false :
    false :
    false;

//
type GroupedTablesToColumnsMap<
    TDbType extends DbType,
    TQueryItems extends readonly (QueryTable<TDbType, any, any, any, any, any> | IExecuteableQuery<TDbType, any, any, any, any, any, any>)[],
    TGroupedColumns extends GroupBySpecs<TDbType> | undefined
> =
    TGroupedColumns extends undefined ?
    undefined :
    {
        [
        T in TQueryItems[number]as
        T extends QueryTable<TDbType, any, any, any, any, infer TAs> ?
        TAs extends undefined ? T["table"]["name"] :
        TAs & string :
        T extends QueryBuilder<TDbType, any, any, any, any, any, infer TAs> ?
        TAs extends undefined ? never :
        TAs & string :
        never
        ]:
        ColumnsSelection<TDbType, T,
            {
                [
                Kc in keyof
                (
                    T extends QueryTable<TDbType, any, any, any, any, any> ? T["columns"] :
                    T extends QueryBuilder<TDbType, any, infer TResult, any, any, any, any> ?
                    TResult extends (infer TItem)[] ? TItem : TResult extends undefined ? never :
                    TResult :
                    never
                )
                ]:
                TGroupedColumns extends GroupBySpecs<TDbType> ?
                IsGroupedColumnsContains<
                    TDbType,
                    SpreadGroupedColumns<TDbType, TGroupedColumns>,
                    (
                        T extends QueryTable<TDbType, any, any, any, any, any> ? T["columns"] :
                        T extends IExecuteableQuery<TDbType, any, infer TResult, any, any, any, any> ?
                        TResult extends (infer TItem)[] ? TItem : TResult extends undefined ? never :
                        TResult :
                        never
                    )[Kc]
                > extends true ?
                (
                    T extends QueryTable<TDbType, any, any, any, any, any> ? T["columns"] :
                    T extends IExecuteableQuery<TDbType, any, infer TResult, any, any, any, any> ?
                    TResult extends (infer TItem)[] ? TItem : TResult extends undefined ? never :
                    TResult :
                    never
                )[Kc] extends IComparable<TDbType, infer TId, infer TParams, infer TValueType, infer TFinalValueType, any, infer TAs> ?
                IComparable<TDbType, TId, TParams, TValueType, TFinalValueType, false, TAs> :
                never :
                (
                    T extends QueryTable<TDbType, any, any, any, any, any> ? T["columns"] :
                    T extends IExecuteableQuery<TDbType, any, infer TResult, any, any, any, any> ?
                    TResult extends (infer TItem)[] ? TItem : TResult extends undefined ? never :
                    TResult :
                    never
                )[Kc] extends IComparable<TDbType, infer TId, infer TParams, infer TValueType, infer TFinalValueType, any, infer TAs> ?
                IComparable<TDbType, TId, TParams, TValueType, TFinalValueType, true, TAs> :
                never :
                never
            }
        >
    }

export type {
    GroupedTablesToColumnsMap,
    SpreadGroupedColumns,
    IsGroupedColumnsContains
}