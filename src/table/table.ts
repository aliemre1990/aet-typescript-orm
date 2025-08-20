import { DbType, PgDbType } from "../db.js";
import { ComparisonOperation } from "../query/comparisonOperation.js";
import type { IExecuteableQuery } from "../query/interfaces/IExecuteableQuery.js";
import { IJoinQuery } from "../query/interfaces/IJoinQuery.js";
import { ISelectQuery } from "../query/interfaces/ISelectQuery.js";
import { QueryBuilder } from "../query/queryBuilder.js";
import type { TableToColumnsMap, TableToObject } from "../query/types/miscellaneous.js";
import type { TResultShape } from "../query/types/result.js";
import type { JoinType } from "../types.js";
import type Column from "./column.js";
import QueryColumn from "./queryColumn.js";
import QueryTable from "./queryTable.js";
import type { QueryTableSpecsType, TableSpecsType } from "./types/tableSpecs.js";
import type { ColumnsObjectType, GetColumnType, QueryColumnsObjectType } from "./types/utils.js";

class ForeignKey {
    constructor(public column: string, public references: { table: string; column: string | 'self-parent' | 'self-child' }) { }
}

class Table<
    TDbType extends DbType,
    TColumns extends ColumnsObjectType<TDbType>,
    TTableName extends string = string,
    TQueryColumns extends QueryColumnsObjectType<TDbType, QueryTableSpecsType> = { [K in keyof TColumns]: QueryColumn<TDbType, TColumns[K], { tableName: TTableName }, undefined> }
> implements
    // ISelectQuery<TDbType, TableToObject<QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns>>>,
    ISelectQuery<TDbType, any>,
    // IJoinQuery<TDbType, TableToObject<QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns>>> {
    IJoinQuery<TDbType, any> {

    constructor(
        public name: TTableName,
        public columns: TColumns,
        public primaryKeys?: (string[])[],
        public uniqueKeys?: (string[])[],
        public foreignKeys?: ForeignKey[]
    ) {

    }

    as<TAsName extends string>(val: TAsName) {
        const queryColumns = Object.entries(this.columns).reduce((prev, curr) => {
            prev[curr[0]] = new QueryColumn(curr[1]);
            return prev;

        }, {} as QueryColumnsObjectType<TDbType, { tableName: TTableName, asTableName: TAsName }>) as { [K in keyof TColumns]: QueryColumn<TDbType, TColumns[K], { tableName: TTableName, asTableName: TAsName }, undefined> };

        return new QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, typeof queryColumns, TAsName>(this, queryColumns, val);
    }

    select<TCb extends undefined>():
        IExecuteableQuery<TDbType, TableToObject<QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns, undefined>>, TCb extends (cols: any) => infer TR ? TR : undefined>
    select<
        TCb extends ((cols: TableToColumnsMap<TableToObject<QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns, undefined>>>) => TResultShape<TDbType>)
    >(cb: TCb):
        IExecuteableQuery<TDbType, TableToObject<QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns, undefined>>, TCb extends (cols: any) => infer TR ? TR : undefined>
    select<
        TCb extends ((cols: TableToColumnsMap<TableToObject<QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns, undefined>>>) => TResultShape<TDbType>)
    >(
        cb?: TCb
    ) {

        const queryColumns = Object.entries(this.columns)
            .reduce((prev, ent) => {
                prev[ent[1].name] = new QueryColumn(ent[1]);
                return prev;
            }, {} as QueryColumnsObjectType<TDbType, QueryTableSpecsType>) as TQueryColumns;

        const queryTable = new QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns, undefined>(this, queryColumns);
        const tables = { [this.name]: queryTable };

        return new QueryBuilder<TDbType, TableToObject<typeof queryTable>>(tables as TableToObject<typeof queryTable>).select(cb);
    }

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
        TInnerJoinTable

    >(
        type: JoinType,
        table: TInnerJoinTable,
        cb: (cols:
            TableToColumnsMap<
                TableToObject<
                    QueryTable<
                        TDbType,
                        TColumns,
                        TTableName,
                        Table<TDbType, TColumns, TTableName>,
                        TQueryColumns
                    >
                > &
                TableToObject<TInnerJoinResult>
            >) => ComparisonOperation
    ) {
        const queryColumns = Object.entries(this.columns).reduce((prev, curr) => {
            prev[curr[0]] = new QueryColumn(curr[1]);
            return prev;
        }, {} as QueryColumnsObjectType<TDbType, QueryTableSpecsType>) as TQueryColumns

        const queryTable = new QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns>(this, queryColumns);
        const tables = {
            [this.name]: queryTable
        };

        return new QueryBuilder<TDbType, TableToObject<typeof queryTable>>(tables as TableToObject<typeof queryTable>).join(type, table as any, cb);
    }
}

function pgTable<
    TTableName extends string,
    TColumns extends Record<string, Column<PgDbType, GetColumnType<PgDbType>, string, TableSpecsType<TTableName>>>
>(
    name: TTableName,
    columns: TColumns,
    primaryKeys?: (string[])[],
    uniqueKeys?: (string[])[],
    foreignKeys?: ForeignKey[]
) {


    return new Table<PgDbType, TColumns, TTableName>(
        name,
        columns,
        primaryKeys,
        uniqueKeys,
        foreignKeys
    );
}

export default Table;

export {
    ForeignKey,
    pgTable
}