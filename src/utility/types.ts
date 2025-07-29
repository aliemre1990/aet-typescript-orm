import { DbType, PgDbType } from "../db.js";
import { PgColumnType } from "../postgresql/dataTypes.js";
import { ComparableColumn } from "../queryBuilder/comparableColumn.js";
import { Column, Table } from "../table.js";


// Create a mapping of table names to their column names
type TableToColumnsMap<T extends { [key: string]: Table<any, any, any, any> }, TIsComparableColumn extends boolean = false, TColumn = null> = {
    [K in keyof T as T[K]["asName"] extends undefined ? T[K]["name"] : T[K]["asName"]]: {
        [C in keyof T[K]["columns"]as T[K]["columns"][C]["name"]]: TIsComparableColumn extends false ? T[K]["columns"][C] : TColumn extends Column<infer TDbType, infer TColumnName, infer TColumnType> ? ComparableColumn<TDbType, TColumnName, TColumnType> : never;
    }
};


type TableToObject<TTable extends Table<any, any, any, any>> = {
    [K in TTable["asName"]as K extends undefined ? TTable["name"] : K]: TTable
}



type GetColumnType<TDbType extends DbType> = TDbType extends PgDbType ? PgColumnType : string;

export type {
    TableToColumnsMap,
    TableToObject
};