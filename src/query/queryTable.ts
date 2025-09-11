import type { DbType } from "../db.js";
import QueryColumn from "../query/queryColumn.js";
import type Table from "../table/table.js";
import type { ColumnsObjectType, QueryColumnsObjectType, QueryTableSpecsType } from "../table/types/utils.js";
import type { JoinType } from "../types.js";
import type { IExecuteableQuery } from "./_interfaces/IExecuteableQuery.js";
import type IJoinClause from "./_interfaces/IJoinClause.js";
import type ISelectClause from "./_interfaces/ISelectClause.js";
import type IWhereClause from "./_interfaces/IWhereClause.js";
import type { TablesToObject, TableToColumnsMap } from "./_types/miscellaneous.js";
import type { DbFunctions, DbOperators } from "./_types/ops.js";
import type { TResultShape } from "./_types/result.js";
import type ColumnComparisonOperation from "./comparisons/_comparisonOperations.js";
import type ColumnLogicalOperation from "./logicalOperations.js";
import { QueryBuilder } from "./queryBuilder.js";

class QueryTable<
    TDbType extends DbType,
    TColumns extends ColumnsObjectType<TDbType>,
    TTableName extends string,
    TTable extends Table<TDbType, TColumns, TTableName>,
    TQColumns extends QueryColumnsObjectType<TDbType>,
    TAsName extends string | undefined = undefined
> implements
    ISelectClause<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>,
    IJoinClause<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>,
    IWhereClause<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]> {

    constructor(public table: TTable, public columns: TQColumns, public asName?: TAsName) { }

    as<TAsName extends string>(val: TAsName) {
        const queryColumns = Object.entries(this.columns).reduce((prev, curr) => {
            prev[curr[0]] = new QueryColumn(curr[1].column, curr[1].asName);
            return prev;

        }, {} as QueryColumnsObjectType<TDbType, QueryTableSpecsType>) as { [K in keyof TColumns]: QueryColumn<TDbType, TColumns[K], { tableName: TTableName, asTableName: TAsName }, string | undefined> };

        return new QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, typeof queryColumns, TAsName>(this.table, queryColumns, val);
    }

    select<TCb extends undefined>():
        IExecuteableQuery<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>], TCb extends (cols: any) => infer TR ? TR : undefined>
    select<
        TCb extends (
            (
                cols: TableToColumnsMap<TablesToObject<[QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>>,
                ops: DbFunctions<TDbType>
            ) => TResultShape<TDbType>)
    >(cb: TCb):
        IExecuteableQuery<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>], TCb extends (cols: any) => infer TR ? TR : undefined>
    select<
        TCb extends (
            (
                cols: TableToColumnsMap<TablesToObject<[QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>>,
                ops: DbFunctions<TDbType>
            ) => TResultShape<TDbType>)
    >(
        cb?: TCb
    ) {

        return new QueryBuilder<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>([this]).select(cb);
    }

    join<
        TInnerJoinTable extends Table<TDbType, any, any> | QueryTable<TDbType, any, any, any, any, any>,
        TCbResult extends ColumnComparisonOperation<TDbType, any, any, any, any> | ColumnLogicalOperation<TDbType, any>,
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
            cols: TableToColumnsMap<TablesToObject<[QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>, TInnerJoinResult]>>,
            ops: DbOperators<TDbType>
        ) => TCbResult
    ) {

        return new QueryBuilder<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>([this])
            .join(type, table, cb);
    }

    where<
        TCbResult extends ColumnComparisonOperation<TDbType, any, any, any, any> | ColumnLogicalOperation<TDbType, any>
    >(cb: (
        cols: TableToColumnsMap<TablesToObject<[QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>>,
        ops: DbOperators<TDbType>
    ) => TCbResult) {


        return new QueryBuilder<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>([this]).where(cb);
    }
}

export default QueryTable;