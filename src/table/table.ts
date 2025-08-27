import { DbType, PgDbType } from "../db.js";
import type { PgValueTypes } from "../postgresql/dataTypes.js";
import type ColumnComparisonOperation from "../query/comparison.js";
import type { IExecuteableQuery } from "../query/_interfaces/IExecuteableQuery.js";
import { IJoinQuery } from "../query/_interfaces/IJoinQuery.js";
import { ISelectQuery } from "../query/_interfaces/ISelectQuery.js";
import type ColumnLogicalOperation from "../query/logicalOperations.js";
import { QueryBuilder } from "../query/queryBuilder.js";
import type { TablesToObject, TableToColumnsMap, TableToObject } from "../query/_types/miscellaneous.js";
import type { InferParamsFromOps, TResultShape } from "../query/_types/result.js";
import type { JoinType } from "../types.js";
import type Column from "./column.js";
import QueryColumn, { type QueryParam } from "../query/queryColumn.js";
import type { QueryTableSpecsType, TableSpecsType } from "./types/tableSpecs.js";
import type { ColumnsObjectType, GetColumnType, QueryColumnsObjectType } from "./types/utils.js";
import QueryTable from "../query/queryTable.js";
import type { IWhereQuery } from "../query/_interfaces/IWhereQuery.js";

class ForeignKey {
    constructor(public column: string, public references: { table: string; column: string | 'self-parent' | 'self-child' }) { }
}

class Table<
    TDbType extends DbType,
    TColumns extends ColumnsObjectType<TDbType>,
    TTableName extends string = string,
    TQueryColumns extends QueryColumnsObjectType<TDbType, QueryTableSpecsType> = { [K in keyof TColumns]: QueryColumn<TDbType, TColumns[K], { tableName: TTableName }, undefined> }
> implements
    ISelectQuery<TDbType, [QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns>]>,
    IJoinQuery<TDbType, [QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns>]>,
    IWhereQuery<TDbType, [QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns>]> {

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
        IExecuteableQuery<TDbType, [QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns, undefined>], TCb extends (cols: any) => infer TR ? TR : undefined>
    select<
        TCb extends ((cols: TableToColumnsMap<TablesToObject<[QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns, undefined>]>>) => TResultShape<TDbType>)
    >(cb: TCb):
        IExecuteableQuery<TDbType, [QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns, undefined>], TCb extends (cols: any) => infer TR ? TR : undefined>
    select<
        TCb extends ((cols: TableToColumnsMap<TablesToObject<[QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns, undefined>]>>) => TResultShape<TDbType>)
    >(
        cb?: TCb
    ) {

        const queryColumns = Object.entries(this.columns)
            .reduce((prev, ent) => {
                prev[ent[1].name] = new QueryColumn(ent[1]);
                return prev;
            }, {} as QueryColumnsObjectType<TDbType, QueryTableSpecsType>) as TQueryColumns;

        const queryTable = new QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns, undefined>(this as any, queryColumns);


        return new QueryBuilder<TDbType, [typeof queryTable]>([queryTable]).select(cb);
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
        cb: (cols:
            TableToColumnsMap<
                TablesToObject<
                    [
                        QueryTable<
                            TDbType,
                            TColumns,
                            TTableName,
                            Table<TDbType, TColumns, TTableName>,
                            TQueryColumns
                        >
                        ,
                        TInnerJoinResult
                    ]
                >
            >) => TCbResult
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
    >(cb: (cols: TableToColumnsMap<TablesToObject<[QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns, undefined>]>>) => TCbResult) {
        const queryColumns = Object.entries(this.columns).reduce((prev, curr) => {
            prev[curr[0]] = new QueryColumn(curr[1]);
            return prev;
        }, {} as QueryColumnsObjectType<TDbType, QueryTableSpecsType>) as TQueryColumns

        const queryTable = new QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns, undefined>(this, queryColumns);

        return new QueryBuilder<TDbType, [typeof queryTable]>([queryTable]).where(cb);
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