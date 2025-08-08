import { DbType, PgDbType } from "../../db.js";
import { PgColumnType } from "../../postgresql/dataTypes.js";
import { Column, Table, TablesObjectType } from "../../table.js";
import type { TableToColumnsMap, TableToObject } from "../../utility/types.js";
import { ComparableColumn } from "../comparableColumn.js";
import { ComparisonOperation } from "../comparisonOperation.js";
import { ISelectQuery } from "./ISelectQuery.js";

interface IJoinQuery<
    TDbType extends DbType,
    TTables extends TablesObjectType<TDbType>,
> {

    innerJoin<TInnerJoinTable extends Table<any, any, any, any>>(
        table: TInnerJoinTable, cb: (cols: TableToColumnsMap<TTables & TableToObject<TInnerJoinTable>>) => ComparisonOperation
    ):
        IJoinQuery<TDbType, TTables & TableToObject<TInnerJoinTable>> &
        ISelectQuery<TDbType, TTables & TableToObject<TInnerJoinTable>>

    leftJoin<TLeftJoinTable extends Table<any, any, any, any>>(
        table: TLeftJoinTable, cb: (cols: TableToColumnsMap<TTables & TableToObject<TLeftJoinTable>>) => ComparisonOperation
    ):
        IJoinQuery<TDbType, TTables & TableToObject<TLeftJoinTable>> &
        ISelectQuery<TDbType, TTables & TableToObject<TLeftJoinTable>>

    rightJoin<TRightJoinTable extends Table<any, any, any, any>>(
        table: TRightJoinTable, cb: (cols: TableToColumnsMap<TTables & TableToObject<TRightJoinTable>>) => ComparisonOperation
    ):
        IJoinQuery<TDbType, TTables & TableToObject<TRightJoinTable>> &
        ISelectQuery<TDbType, TTables & TableToObject<TRightJoinTable>>

    fullJoin<TFullJoinTable extends Table<any, any, any, any>>(
        table: TFullJoinTable, cb: (cols: TableToColumnsMap<TTables & TableToObject<TFullJoinTable>>) => ComparisonOperation
    ):
        IJoinQuery<TDbType, TTables & TableToObject<TFullJoinTable>> &
        ISelectQuery<TDbType, TTables & TableToObject<TFullJoinTable>>
}

export type {
    IJoinQuery
}