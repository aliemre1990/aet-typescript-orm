import type { DbType } from "../../db.js";
import type { DeepPrettify } from "../../utility/common.js";
import type ColumnComparisonOperation from "../comparisons/_comparisonOperations.js";
import type ColumnLogicalOperation from "../logicalOperations.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type QueryParam from "../param.js";
import type { OrderBySpecs, OrderType } from "../_interfaces/IOrderByClause.js";

type TResultShape<TDbType extends DbType> = readonly IComparable<TDbType, any, any, any, any, false, any, any>[]


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
            [
            R in T[number]as R extends IComparable<TDbType, any, any, any, any, any, infer TDefaultKey, infer TAs> ?
            TAs extends undefined ?
            TDefaultKey :
            TAs :
            never
            ]:
            R extends IComparable<TDbType, any, any, any, infer TFinalType, any, any, any> ? TFinalType :
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

export type {
    TResultShape,
    ColumnsToResultMap,
    QueryParamsToObject
}