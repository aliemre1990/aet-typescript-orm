import type { DbType } from "../../db.js";
import type ColumnsSelection from "../columnsSelection.js";
import type CTEObject from "../cteObject.js";
import type { CTESpecsType, FromItemType, FromType, JoinSpecsType } from "../queryBuilder.js";
import type QueryTable from "../queryTable.js";
import type SubQueryObject from "../subQueryObject.js";

type MapCtesToSelectionType<TDbType extends DbType, TCTESpecs extends CTESpecsType<TDbType> | undefined> =
    TCTESpecs extends undefined ? {} :
    TCTESpecs extends CTESpecsType<TDbType> ?
    {
        [C in TCTESpecs[number]as C["name"]]: C
    } :
    never;

type TableToColumnsMap<
    TDbType extends DbType,
    T extends { [key: string]: FromItemType<TDbType> }
> = {
        [K in keyof T]: ColumnsSelection<
            TDbType,
            T[K],
            T[K] extends QueryTable<TDbType, any, any, any, any, any> ? T[K]["columnsList"] :
            T[K] extends SubQueryObject<TDbType, any, infer TSubQueryEntries, string> ?
            TSubQueryEntries extends undefined ? never :
            TSubQueryEntries :
            T[K] extends CTEObject<TDbType, any, any, any, any> ?
            T[K]["cteObjectEntries"] extends undefined ? never :
            T[K]["cteObjectEntries"] :
            never
        >
    };

type TablesToObject<
    TDbType extends DbType,
    TFrom extends FromType<TDbType> | undefined,
    TInnerJoinSpecs extends JoinSpecsType<TDbType> | undefined = undefined,
    TCTESpecs extends CTESpecsType<TDbType> | undefined = undefined
> =
    (
        TFrom extends undefined ? {} :
        TFrom extends FromType<TDbType> ?
        {
            [
            T in TFrom[number]as
            T extends QueryTable<TDbType, any, any, any, any, any> ?
            T["name"] :
            T extends SubQueryObject<TDbType, any, any, any> ?
            T["name"] :
            never
            ]: T
        } : {}
    ) &
    (
        TInnerJoinSpecs extends undefined ? {} :
        TInnerJoinSpecs extends JoinSpecsType<TDbType> ?
        {
            [
            T in TInnerJoinSpecs[number]as T["table"] extends
            QueryTable<TDbType, any, any, any, any, any> ?
            T["table"]["name"] :
            T["table"] extends SubQueryObject<TDbType, any, any, any> ?
            T["table"]["name"] :
            never
            ]: T["table"]
        }
        : never
    ) &
    (
        TCTESpecs extends undefined ? {} :
        TCTESpecs extends CTESpecsType<TDbType> ?
        {
            [
            T in TCTESpecs[number]as T["name"]
            ]: T
        }
        : never
    )

export type {
    TableToColumnsMap,
    TablesToObject,
    MapCtesToSelectionType
}