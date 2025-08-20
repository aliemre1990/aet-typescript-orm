import type { DbType } from "../../db.js";
import type { PgTypeToJsType } from "../../postgresql/dataTypes.js";
import type QueryColumn from "../../table/queryColumn.js";
import type QueryTable from "../../table/queryTable.js";
import type { ColumnType, QueryTablesObjectType, QueryTableSpecsType } from "../../table/types/utils.js";
import type { IsPlural, ToSingular } from "../../utility/string.js";
import type { DeepPrettify, FlattenObject, UnionToTupleOrdered } from "../../utility/common.js";

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


export type {
    TResultShape,
    TablesToResultMap,
    ColumnsToResultMap
}