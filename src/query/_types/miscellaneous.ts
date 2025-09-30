import type { DbType } from "../../db.js";
import type { IExecuteableQuery } from "../_interfaces/IExecuteableQuery.js";
import type ColumnsSelection from "../ColumnsSelection.js";
import type QueryTable from "../queryTable.js";

type TableToColumnsMap<TDbType extends DbType, T extends { [key: string]: QueryTable<TDbType, any, any, any, any, any> | IExecuteableQuery<TDbType, any, any, any, any, any, any> }> = {
    [K in keyof T]: ColumnsSelection<
        TDbType,
        T[K],
        T[K] extends QueryTable<TDbType, any, any, any, any, any> ? T[K]["columnsList"] :
        T[K] extends IExecuteableQuery<TDbType, any, infer TResult, any, any, any, any> ?
        TResult extends undefined ? never :
        TResult :
        never
    >
};

type TablesToObject<TDbType extends DbType, TTables extends readonly (QueryTable<TDbType, any, any, any, any, any> | IExecuteableQuery<TDbType, any, any, any, any, any, any>)[]> = {
    [
    T in TTables[number]as
    T extends QueryTable<TDbType, any, any, any, any, any> ?
    T["asName"] extends undefined ?
    T["table"]["name"] : T["asName"] & string :
    T extends IExecuteableQuery<TDbType, any, any, any, any, any, infer TAs> ?
    TAs extends undefined ? never : TAs & string :
    never
    ]: T
}

export type {
    TableToColumnsMap,
    TablesToObject
}