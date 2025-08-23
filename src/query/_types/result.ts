import type { DbType } from "../../db.js";
import type { PgTypeToJsType } from "../../postgresql/dataTypes.js";
import type QueryColumn from "../queryColumn.js";
import type { ColumnType, QueryTablesObjectType, QueryTableSpecsType } from "../../table/types/utils.js";
import type { IsPlural, ToSingular } from "../../utility/string.js";
import type { DeepPrettify, FlattenObject, UnionToTupleOrdered } from "../../utility/common.js";
import type { QueryParam } from "../queryColumn.js";
import type ColumnComparisonOperation from "../comparison.js";
import type ColumnLogicalOperation from "../logicalOperations.js";
import type QueryTable from "../queryTable.js";

type TResultShape<TDbType extends DbType> = {
    [key: string]: QueryColumn<TDbType, ColumnType<TDbType>, QueryTableSpecsType, string | undefined> | TResultShape<TDbType>;
};


type TablesToResultMap<TDbType extends DbType, T extends QueryTablesObjectType<TDbType>> =
    T extends undefined ? undefined :
    UnionToTupleOrdered<T[keyof T]>["length"] extends 0 ?
    undefined :
    UnionToTupleOrdered<T[keyof T]>["length"] extends 1 ?
    FlattenObject<{
        [K in keyof T as T[K] extends QueryTable<TDbType, any, any, any, any, any> ? K : never]:
        {
            [C in keyof T[K]["columns"]as T[K]["columns"][C]["column"]["name"]]: PgTypeToJsType<T[K]["columns"][C]["column"]["type"]>
        }

    }> :
    FlattenObject<{
        [K in keyof T as T[K] extends QueryTable<TDbType, any, any, any, any, any> ? K : never]:
        {
            [C in keyof T[K]["columns"]as  `${IsPlural<K & string> extends true ? ToSingular<K & string> : K & string}${Capitalize<T[K]["columns"][C]["column"]["name"]>}`]: PgTypeToJsType<T[K]["columns"][C]["column"]["type"]>
        }
    }>;
//  [C in keyof T[keyof T]["columns"]as T[keyof T]["columns"][C] extends QueryColumn<TDbType, any, any, any> ? C : never]:
//       PgTypeToJsType<T[keyof T]["columns"][C]["column"]["type"]>

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

// Convert array of QueryParam to object type
type QueryParamsToObject<T extends readonly QueryParam<any, any, any>[] | undefined> = T extends undefined ?
    undefined :
    T extends readonly QueryParam<any, any, any>[] ? {
        [K in T[number]as K extends QueryParam<any, infer Name, any> ? Name : never]:
        K extends QueryParam<any, any, infer ValueType> ? ValueType : never
    } : undefined;



type InferParamsFromOps<T> =
    T extends ColumnComparisonOperation<any, any, infer TParams> ?
    TParams extends readonly QueryParam<any, any, any>[] ? TParams : [] :
    T extends ColumnLogicalOperation<any, infer TOps> ?
    InferParamsFromOpsArray<TOps> :
    [];

type InferParamsFromOpsArray<T extends readonly any[]> =
    T extends readonly [infer First, ...infer Rest] ?
    [...InferParamsFromOps<First>, ...InferParamsFromOpsArray<Rest>] :
    [];

type AccumulateParams<TParams extends QueryParam<any, any, any>[] | undefined, TCbResult extends ColumnComparisonOperation<any, any, any> | ColumnLogicalOperation<any, any>> =
    TParams extends undefined ?
    InferParamsFromOps<TCbResult>["length"] extends 0 ? undefined : InferParamsFromOps<TCbResult> :
    TParams extends QueryParam<any, any, any>[] ? [...TParams, ...(InferParamsFromOps<TCbResult>["length"] extends 0 ? [] : InferParamsFromOps<TCbResult>)] :
    never;

export type {
    TResultShape,
    TablesToResultMap,
    ColumnsToResultMap,
    QueryParamsToObject,
    InferParamsFromOps,
    AccumulateParams
}