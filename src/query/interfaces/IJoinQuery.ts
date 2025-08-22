import { DbType, PgDbType } from "../../db.js";
import { PgColumnType, type PgValueTypes } from "../../postgresql/dataTypes.js";
import type { QueryParam } from "../../table/queryColumn.js";
import type QueryColumn from "../../table/queryColumn.js";
import type QueryTable from "../../table/queryTable.js";
import type Table from "../../table/table.js";
import type { ColumnsObjectType, QueryTablesObjectType, QueryTableSpecsType } from "../../table/types/utils.js";
import type { JoinType } from "../../types.js";
import type ColumnComparisonOperation from "../comparison.js";
import type ColumnLogicalOperation from "../logicalOperations.js";
import type { TableToColumnsMap, TableToObject } from "../types/miscellaneous.js";
import type { InferParamsFromOps } from "../types/result.js";
import { ISelectQuery } from "./ISelectQuery.js";

interface IJoinQuery<
    TDbType extends DbType,
    TTables extends QueryTablesObjectType<TDbType>,
    TParams extends QueryParam<TDbType, string, PgValueTypes>[] | undefined = undefined
> {

    join<
        TInnerJoinTableQueryTableSpecs extends QueryTableSpecsType,
        TInnerJoinTableAs extends string | undefined,
        TInnerJoinTableName extends string,
        TInnerJoinColumns extends ColumnsObjectType<TDbType>,
        TInnerJoinTable extends Table<TDbType, TInnerJoinColumns, TInnerJoinTableName> | QueryTable<TDbType, TInnerJoinColumns, TInnerJoinTableName, Table<TDbType, TInnerJoinColumns, TInnerJoinTableName>, { [K in keyof TInnerJoinColumns]: QueryColumn<TDbType, TInnerJoinColumns[K], TInnerJoinTableQueryTableSpecs, string | undefined> }, TInnerJoinTableAs>,
        TInnerJoinResult extends TInnerJoinTable extends Table<TDbType, infer TInnerCols, infer TInnerTableName> ?
        QueryTable<
            TDbType,
            TInnerCols,
            TInnerTableName,
            Table<TDbType, TInnerCols, TInnerTableName>,
            { [K in keyof TInnerCols]: QueryColumn<TDbType, TInnerCols[K], { tableName: TInnerTableName }> }
        > :
        TInnerJoinTable,
        TCbResult extends ColumnComparisonOperation<TDbType, any, any> | ColumnLogicalOperation<TDbType, any>
    >(
        type: JoinType,
        table: TInnerJoinTable,
        cb: (cols: TableToColumnsMap<TTables & TableToObject<TInnerJoinResult>>) => TCbResult
    ):
        IJoinQuery<TDbType, TTables & TableToObject<TInnerJoinResult>, [...(TParams extends undefined ? [] : TParams), ...(InferParamsFromOps<TCbResult> extends undefined ? [] : InferParamsFromOps<TCbResult>)]> &
        ISelectQuery<TDbType, TTables & TableToObject<TInnerJoinResult>, [...(TParams extends undefined ? [] : TParams), ...(InferParamsFromOps<TCbResult> extends undefined ? [] : InferParamsFromOps<TCbResult>)]>

}

export type {
    IJoinQuery
}