import type { DbType, PgDbType } from "../../db.js";
import type { PgTypeToJsType } from "../../postgresql/dataTypes.js";
import type Column from "../../table/column.js";
import type Table from "../../table/table.js";
import type { ColumnsObjectType, QueryColumnsObjectType } from "../../table/types/utils.js";
import type QueryTable from "../queryTable.js";

type TableToColumnsMap<T extends { [key: string]: QueryTable<DbType, ColumnsObjectType<DbType>, string, Table<DbType, ColumnsObjectType<DbType>, string>, QueryColumnsObjectType<DbType>, string | undefined> }, TIsComparableColumn extends boolean = false, TColumn = null> = {
    [K in keyof T]: {
        [C in keyof T[K]["columns"]as T[K]["columns"][C]["column"]["name"]]: T[K]["columns"][C];
    }
};

type TableToObject<TTable extends QueryTable<DbType, ColumnsObjectType<DbType>, string, Table<DbType, ColumnsObjectType<DbType>, string>, QueryColumnsObjectType<DbType>, string | undefined>> = {
    [K in TTable["asName"] extends undefined ? TTable["table"]["name"] : TTable["asName"] & string]: TTable
}

type TablesToObject<TTables extends QueryTable<DbType, any, any, any, any, any>[]> = {
    [
    T in TTables[number]as
    T extends QueryTable<DbType, any, any, any, any, any> ?
    T["asName"] extends undefined ?
    T["table"]["name"] : T["asName"] & string
    : never
    ]: T
}

type GetColumnTypeFromDbType<TDbType extends DbType, TColumn extends Column<TDbType, any, any, any>> =
    TDbType extends PgDbType ? PgTypeToJsType<TColumn["type"]> : never;

export type {
    TableToColumnsMap,
    TableToObject,
    GetColumnTypeFromDbType,
    TablesToObject
}