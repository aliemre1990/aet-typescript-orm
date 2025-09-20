import { DbType, dbTypes, PgDbType } from "../db.js";
import type { PgColumnType } from "./columnTypes.js";
import type ColumnComparisonOperation from "../query/comparisons/_comparisonOperations.js";
import type { IExecuteableQuery } from "../query/_interfaces/IExecuteableQuery.js";
import type ColumnLogicalOperation from "../query/logicalOperations.js";
import { QueryBuilder } from "../query/queryBuilder.js";
import type { TablesToObject, TableToColumnsMap } from "../query/_types/miscellaneous.js";
import type { AccumulateColumnParams, AccumulateOrderByParams, TResultShape } from "../query/_types/result.js";
import Column, { type ColumnsObjectType } from "./column.js";
import QueryColumn, { type QueryColumnsObjectType } from "../query/queryColumn.js";
import QueryTable, { type QueryTableSpecsType } from "../query/queryTable.js";
import type IJoinClause from "../query/_interfaces/IJoinClause.js";
import type ISelectClause from "../query/_interfaces/ISelectClause.js";
import type IWhereClause from "../query/_interfaces/IWhereClause.js";
import type IGroupByClause from "../query/_interfaces/IGroupByClause.js";
import type { DbFunctions, DbOperators } from "../query/_types/ops.js";
import type { JoinType } from "../query/_interfaces/IJoinClause.js";
import type IOrderByClause from "../query/_interfaces/IOrderByClause.js";
import type { OrderBySpecs } from "../query/_interfaces/IOrderByClause.js";
import type { GroupBySpecs } from "../query/_interfaces/IGroupByClause.js";

type TableSpecsType<TTableName extends string = string> = { tableName: TTableName }

type TableType<TDbType extends DbType, TColumns extends ColumnsObjectType<TDbType>, TTableName extends string = string> = Table<TDbType, TColumns, TTableName>;
type TablesObjectType<TDbType extends DbType> = { [key: string]: TableType<TDbType, ColumnsObjectType<TDbType>> };

class ForeignKey {
    constructor(public column: string, public references: { table: string; column: string | 'self-parent' | 'self-child' }) { }
}

class Table<
    TDbType extends DbType,
    TColumns extends ColumnsObjectType<TDbType>,
    TTableName extends string,
    TQueryColumns extends QueryColumnsObjectType<TDbType, QueryTableSpecsType> = { [K in keyof TColumns]: QueryColumn<TDbType, TColumns[K], QueryTableSpecsType<TTableName>, undefined> }
> implements
    ISelectClause<TDbType, [QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns>]>,
    IJoinClause<TDbType, [QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns>]>,
    IWhereClause<TDbType, [QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns>]>,
    IGroupByClause<TDbType, [QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns>]>,
    IOrderByClause<TDbType, [QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns>]> {

    constructor(
        public DbType: TDbType,
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

    select<
        TCb extends
        (
            cols: TableToColumnsMap<TDbType, TablesToObject<TDbType,[QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns, undefined>]>>,
            ops: DbFunctions<TDbType, false>
        ) => TResultShape<TDbType>,
        TCbResult extends TResultShape<TDbType> = TCb extends (cols: any, ops: any) => infer TR ? TR : never
    >(
        cb: TCb
    ): IExecuteableQuery<TDbType, [QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns, undefined>], TCbResult[], AccumulateColumnParams<undefined, TCbResult>> {

        const queryColumns = Object.entries(this.columns)
            .reduce((prev, ent) => {
                prev[ent[1].name] = new QueryColumn(ent[1]);
                return prev;
            }, {} as QueryColumnsObjectType<TDbType, QueryTableSpecsType>) as TQueryColumns;

        const queryTable = new QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns, undefined>(this as any, queryColumns);


        return new QueryBuilder<TDbType, [typeof queryTable]>([queryTable]).select<TCb, TCbResult>(cb);
    }

    join<
        TInnerJoinTable extends Table<TDbType, any, any> | QueryTable<TDbType, any, any, any, any, any>,
        TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>,
        TInnerJoinResult extends QueryTable<TDbType, any, any, any, any, any> = TInnerJoinTable extends Table<TDbType, infer TInnerCols, infer TInnerTableName> ?
        QueryTable<
            TDbType,
            TInnerCols,
            TInnerTableName,
            Table<TDbType, TInnerCols, TInnerTableName>,
            { [K in keyof TInnerCols]: QueryColumn<TDbType, TInnerCols[K], { tableName: TInnerTableName }> }
        > :
        TInnerJoinTable,

    >(
        type: JoinType,
        table: TInnerJoinTable,
        cb: (
            cols: TableToColumnsMap<TDbType, TablesToObject<TDbType,[QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns>, TInnerJoinResult]>>,
            ops: DbOperators<TDbType, false>
        ) => TCbResult
    ) {
        const queryColumns = Object.entries(this.columns).reduce((prev, curr) => {
            prev[curr[0]] = new QueryColumn(curr[1]);
            return prev;
        }, {} as QueryColumnsObjectType<TDbType, QueryTableSpecsType>) as TQueryColumns

        const queryTable = new QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns>(this, queryColumns);


        return new QueryBuilder<TDbType, [typeof queryTable]>([queryTable])
            .join(type, table, cb);
    }

    where<
        TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>
    >(cb: (
        cols: TableToColumnsMap<TDbType, TablesToObject<TDbType,[QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns, undefined>]>>,
        ops: DbOperators<TDbType, false>
    ) => TCbResult) {
        const queryColumns = Object.entries(this.columns).reduce((prev, curr) => {
            prev[curr[0]] = new QueryColumn(curr[1]);
            return prev;
        }, {} as QueryColumnsObjectType<TDbType, QueryTableSpecsType>) as TQueryColumns

        const queryTable = new QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName, any>, TQueryColumns, undefined>(this, queryColumns);

        return new QueryBuilder<TDbType, [typeof queryTable]>([queryTable]).where(cb);
    }

    groupBy<
        const TCbResult extends GroupBySpecs<TDbType>
    >(cb: (cols: TableToColumnsMap<TDbType, TablesToObject<TDbType,[QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns, undefined>]>>) => TCbResult) {
        const queryColumns = Object.entries(this.columns).reduce((prev, curr) => {
            prev[curr[0]] = new QueryColumn(curr[1]);
            return prev;
        }, {} as QueryColumnsObjectType<TDbType, QueryTableSpecsType>) as TQueryColumns

        const queryTable = new QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName, any>, TQueryColumns, undefined>(this, queryColumns);

        return new QueryBuilder<TDbType, [typeof queryTable]>([queryTable]).groupBy(cb);
    }

    orderBy<
        const TCbResult extends OrderBySpecs<TDbType>
    >(cb: (cols: TableToColumnsMap<TDbType, TablesToObject<TDbType,[QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns, undefined>]>>) => TCbResult):
        ISelectClause<TDbType, [QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns, undefined>], AccumulateOrderByParams<TDbType, undefined, TCbResult>> {
        const queryColumns = Object.entries(this.columns).reduce((prev, curr) => {
            prev[curr[0]] = new QueryColumn(curr[1]);
            return prev;
        }, {} as QueryColumnsObjectType<TDbType, QueryTableSpecsType>) as TQueryColumns

        const queryTable = new QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName, any>, TQueryColumns, undefined>(this, queryColumns);

        return new QueryBuilder<TDbType, [typeof queryTable]>([queryTable]).orderBy(cb);
    }
}

function pgTable<
    TTableName extends string,
    TColumns extends Record<string, Column<PgDbType, PgColumnType, string, TableSpecsType<string>, boolean>>,
>(
    name: TTableName,
    columns: TColumns,
    primaryKeys?: (string[])[],
    uniqueKeys?: (string[])[],
    foreignKeys?: ForeignKey[]
) {

    type TFinalColumns = { [K in keyof TColumns]: Column<PgDbType, TColumns[K]["type"], TColumns[K]["name"], TableSpecsType<TTableName>, TColumns[K]["isNullable"]> };

    return new Table<PgDbType, TFinalColumns, TTableName>(
        dbTypes.postgresql,
        name,
        columns as unknown as TFinalColumns,
        primaryKeys,
        uniqueKeys,
        foreignKeys
    );
}

function pgColumn<
    TColumnName extends string,
    TColumnType extends PgColumnType,
    TIsNull extends boolean,
>(
    name: TColumnName,
    type: TColumnType,
    isNullable: TIsNull
): Column<PgDbType, TColumnType, TColumnName, TableSpecsType, TIsNull> {
    return new Column<PgDbType, TColumnType, TColumnName, TableSpecsType, TIsNull>(name, type, isNullable);
}

export default Table;

export {
    ForeignKey,
    pgTable,
    pgColumn
}

export type {
    TableSpecsType,
    TableType,
    TablesObjectType
}