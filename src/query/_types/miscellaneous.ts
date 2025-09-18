import type { DbType, PgDbType } from "../../db.js";
import type Table from "../../table/table.js";
import type { ColumnsObjectType, QueryColumnsObjectType } from "../../table/types/utils.js";
import type { ColumnsSelection } from "../queryColumn.js";
import type QueryTable from "../queryTable.js";

type TableToColumnsMap<TDbType extends DbType, T extends { [key: string]: QueryTable<TDbType, any, any, any, any, any> }> = {
    [K in keyof T]: ColumnsSelection<TDbType, T[K], T[K]["columns"]>
};

type TableToObject<TTable extends QueryTable<DbType, ColumnsObjectType<DbType>, string, Table<DbType, ColumnsObjectType<DbType>, string>, QueryColumnsObjectType<DbType>, string | undefined>> = {
    [K in TTable["asName"] extends undefined ? TTable["table"]["name"] : TTable["asName"] & string]: TTable
}

type TablesToObject<TTables extends readonly QueryTable<DbType, any, any, any, any, any>[]> = {
    [
    T in TTables[number]as
    T extends QueryTable<DbType, any, any, any, any, any> ?
    T["asName"] extends undefined ?
    T["table"]["name"] : T["asName"] & string
    : never
    ]: T
}

export type {
    TableToColumnsMap,
    TableToObject,
    TablesToObject
}