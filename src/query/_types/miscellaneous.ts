import type { DbType } from "../../db.js";
import type { IExecuteableQuery } from "../_interfaces/IExecuteableQuery.js";
import type ColumnsSelection from "../columnsSelection.js";
import type { JoinSpecsType } from "../queryBuilder.js";
import type QueryTable from "../queryTable.js";

type TableToColumnsMap<TDbType extends DbType, T extends { [key: string]: QueryTable<TDbType, any, any, any, any, any> | IExecuteableQuery<TDbType, any, any, any, any, any, any> }> = {
    [K in keyof T]: ColumnsSelection<
        TDbType,
        T[K],
        T[K] extends QueryTable<TDbType, any, any, any, any, any> ? T[K]["columnsList"] :
        T[K] extends IExecuteableQuery<TDbType, any, any, infer TResult, any, any, any> ?
        TResult extends undefined ? never :
        TResult :
        never
    >
};

type TablesToObject<
    TDbType extends DbType,
    TFrom extends readonly (QueryTable<TDbType, any, any, any, any, any> | IExecuteableQuery<TDbType, any, any, any, any, any, any>)[],
    TInnerJoinSpecs extends JoinSpecsType<TDbType> | undefined = undefined

> = {
    [
    T in TFrom[number]as
    T extends QueryTable<TDbType, any, any, any, any, any> ?
    T["asName"] extends undefined ?
    T["table"]["name"] : T["asName"] & string :
    T extends IExecuteableQuery<TDbType, any, any, any, any, any, infer TAs> ?
    TAs extends undefined ? never : TAs & string :
    never
    ]: T
} &
    (
        TInnerJoinSpecs extends undefined ? {} :
        TInnerJoinSpecs extends JoinSpecsType<TDbType> ?
        {
            [
            T in TInnerJoinSpecs[number]as T["table"] extends QueryTable<TDbType, any, any, any, any, any> ?
            T["table"]["asName"] extends undefined ?
            T["table"]["table"]["name"] : T["table"]["asName"] & string :
            T["table"] extends IExecuteableQuery<TDbType, any, any, any, any, any, infer TAs> ?
            TAs extends undefined ? never : TAs & string :
            never
            ]: T["table"]
        }
        : never
    )

export type {
    TableToColumnsMap,
    TablesToObject
}