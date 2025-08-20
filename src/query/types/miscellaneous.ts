import type { DbType } from "../../db.js";
import type QueryTable from "../../table/queryTable.js";
import type Table from "../../table/table.js";
import type { ColumnsObjectType, QueryColumnsObjectType } from "../../table/types/utils.js";

type TableToColumnsMap<T extends { [key: string]: QueryTable<DbType, ColumnsObjectType<DbType>, string, Table<DbType, ColumnsObjectType<DbType>, string>, QueryColumnsObjectType<DbType>, string | undefined> }, TIsComparableColumn extends boolean = false, TColumn = null> = {
    [K in keyof T]: {
        [C in keyof T[K]["columns"]as T[K]["columns"][C]["column"]["name"]]: T[K]["columns"][C];
    }
};

type TableToObject<TTable extends QueryTable<DbType, ColumnsObjectType<DbType>, string, Table<DbType, ColumnsObjectType<DbType>, string>, QueryColumnsObjectType<DbType>, string | undefined>> = {
    [K in TTable["asName"] extends undefined ? TTable["table"]["name"] : TTable["asName"] & string]: TTable
}

export type {
    TableToColumnsMap,
    TableToObject,
}