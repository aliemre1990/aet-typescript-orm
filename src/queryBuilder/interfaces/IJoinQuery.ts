import { DbType, PgDbType } from "../../db.js";
import { PgColumnType } from "../../postgresql/dataTypes.js";
import { Column, Table, TablesObjectType, type ColumnsObjectType, type QueryColumn, type QueryColumnsObjectType, type QueryTable, type QueryTablesObjectType, type QueryTableSpecsType, type TableToColumnsMap, type TableToObject, type TableType } from "../../table.js";
import { ComparableColumn } from "../comparableColumn.js";
import { ComparisonOperation } from "../comparisonOperation.js";
import { ISelectQuery } from "./ISelectQuery.js";

interface IJoinQuery<
    TDbType extends DbType,
    TTables extends QueryTablesObjectType<TDbType>,
> {

    innerJoin<
        TInnerJoinAs extends string | undefined,
        TInnerJoinTable extends Table<TDbType, any, any> | QueryTable<TDbType, any, any, any, any, TInnerJoinAs>,
        TInnerJoinResult extends
        TInnerJoinTable extends Table<TDbType, infer TColumns, infer TTableName> ?
        QueryTable<
            TDbType,
            TColumns,
            TTableName,
            Table<TDbType, TColumns, TTableName>,
            { [K in keyof TColumns]: QueryColumn<TDbType, TColumns[K], QueryTableSpecsType, string | undefined> }
        > : TInnerJoinTable
    >(
        table: TInnerJoinTable,
        cb: (cols: TableToColumnsMap<TTables & TableToObject<TInnerJoinResult>>) => ComparisonOperation
    ):
        IJoinQuery<
            TDbType,
            TTables &
            TableToObject<TInnerJoinResult>
        > &
        ISelectQuery<TDbType, TTables & TableToObject<TInnerJoinResult>>

    // leftJoin<TLeftJoinTable extends Table<any, any, any, any>>(
    //     table: TLeftJoinTable, cb: (cols: TableToColumnsMap<TTables & TableToObject<TLeftJoinTable>>) => ComparisonOperation
    // ):
    //     IJoinQuery<TDbType, TTables & TableToObject<TLeftJoinTable>> &
    //     ISelectQuery<TDbType, TTables & TableToObject<TLeftJoinTable>>

    // rightJoin<TRightJoinTable extends Table<any, any, any, any>>(
    //     table: TRightJoinTable, cb: (cols: TableToColumnsMap<TTables & TableToObject<TRightJoinTable>>) => ComparisonOperation
    // ):
    //     IJoinQuery<TDbType, TTables & TableToObject<TRightJoinTable>> &
    //     ISelectQuery<TDbType, TTables & TableToObject<TRightJoinTable>>

    // fullJoin<TFullJoinTable extends Table<any, any, any, any>>(
    //     table: TFullJoinTable, cb: (cols: TableToColumnsMap<TTables & TableToObject<TFullJoinTable>>) => ComparisonOperation
    // ):
    //     IJoinQuery<TDbType, TTables & TableToObject<TFullJoinTable>> &
    //     ISelectQuery<TDbType, TTables & TableToObject<TFullJoinTable>>
}

export type {
    IJoinQuery
}