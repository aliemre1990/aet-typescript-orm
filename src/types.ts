import type { DbType, PgDbType } from "./db.js";
import type { PgColumnType, PgTypeToJsType } from "./postgresql/dataTypes.js";
import type { ComparableColumn } from "./queryBuilder/comparableColumn.js";
import type { Column, ColumnTableSpecs, ColumnType, Table } from "./table.js";

// Create a mapping of table names to their column names
type TableToColumnsMap<T extends { [key: string]: Table<any, any, any, any> }, TIsComparableColumn extends boolean = false, TColumn = null> = {
    // [K in keyof T as T[K]["asName"] extends undefined ? T[K]["name"] : T[K]["asName"]]: {
    [K in keyof T]: {
        [C in keyof T[K]["columns"]as T[K]["columns"][C]["name"]]: TIsComparableColumn extends false ? T[K]["columns"][C] : TColumn extends Column<infer TDbType, infer TColumnName, infer TColumnType> ? ComparableColumn<TDbType, TColumnName, TColumnType> : never;
    }
};

type TableToObject<TTable extends Table<any, any, any, any>> = {
    [K in TTable["asName"]as K extends undefined ? TTable["name"] : K]: TTable
}




type ColumnsToResultMap<TDbType extends DbType, T extends { [key: string]: ColumnType<TDbType, any, any> | Record<PropertyKey, ColumnType<TDbType, any, any>> } | undefined> =
    T extends undefined ? undefined :
    // Individual columns
    {
        [K in keyof T as T[K] extends ColumnType<TDbType, any, any> ?
        T[K]["asName"] extends string ? T[K]["asName"] : K : never]:
        T[K] extends ColumnType<TDbType, any, any> ? PgTypeToJsType<T[K]["type"]> : never
    }
    // Nested column objects - flattened
    & {
        [K in keyof T as T[K] extends Record<PropertyKey, ColumnType<TDbType, any, any>> ?
        keyof T[K] extends string ?
        T[K][keyof T[K]] extends ColumnType<TDbType, infer TTableSpecs, any> ?
        `${(TTableSpecs extends { tableAs: string } ? TTableSpecs["tableAs"] : string & K)}${Capitalize<T[K][keyof T[K]]["name"] & string>}`
        : never
        : never
        : never]:
        T[K] extends Record<PropertyKey, ColumnType<TDbType, any, any>> ?
        T[K][keyof T[K]] extends ColumnType<TDbType, any, any> ? PgTypeToJsType<T[K][keyof T[K]]["type"]> : never
        : never
    }

type GetColumnType<TDbType extends DbType> = TDbType extends PgDbType ? PgColumnType : string;

export type {
    TableToColumnsMap,
    TableToObject,
    GetColumnType,
    ColumnsToResultMap
}