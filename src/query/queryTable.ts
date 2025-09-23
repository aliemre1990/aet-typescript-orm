import type { DbType } from "../db.js";
import QueryColumn, { type QueryColumnsObjectType } from "../query/queryColumn.js";
import type { ColumnsObjectType } from "../table/column.js";
import type Table from "../table/table.js";
import type { IDbType } from "./_interfaces/IDbType.js";
import type { IExecuteableQuery } from "./_interfaces/IExecuteableQuery.js";
import type { GroupBySpecs } from "./_interfaces/IGroupByClause.js";
import type IGroupByClause from "./_interfaces/IGroupByClause.js";
import type { JoinType } from "./_interfaces/IJoinClause.js";
import type IJoinClause from "./_interfaces/IJoinClause.js";
import type { OrderBySpecs } from "./_interfaces/IOrderByClause.js";
import type IOrderByClause from "./_interfaces/IOrderByClause.js";
import type ISelectClause from "./_interfaces/ISelectClause.js";
import type IWhereClause from "./_interfaces/IWhereClause.js";
import type { TablesToObject, TableToColumnsMap } from "./_types/miscellaneous.js";
import type { DbFunctions, DbOperators } from "./_types/ops.js";
import type { AccumulateColumnParams, AccumulateOrderByParams, TResultShape } from "./_types/result.js";
import type ColumnComparisonOperation from "./comparisons/_comparisonOperations.js";
import type ColumnLogicalOperation from "./logicalOperations.js";
import QueryBuilder from "./queryBuilder.js";

class QueryTable<
    TDbType extends DbType,
    TColumns extends ColumnsObjectType<TDbType>,
    TTableName extends string,
    TTable extends Table<TDbType, TColumns, TTableName>,
    TQColumns extends QueryColumnsObjectType<TDbType>,
    TAsName extends string | undefined = undefined
> implements
    IDbType<TDbType>,
    ISelectClause<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>,
    IJoinClause<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>,
    IWhereClause<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>,
    IGroupByClause<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>,
    IOrderByClause<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]> {

    dbType: TDbType;

    constructor(dbType: TDbType, public table: TTable, public columns: TQColumns, public asName?: TAsName) {
        this.dbType = dbType;
    }

    select<
        TCb extends
        (
            cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>>,
            ops: DbFunctions<TDbType, false>
        ) => TResultShape<TDbType>,
        TCbResult extends TResultShape<TDbType> = TCb extends (cols: any, ops: any) => infer TR ? TR : never
    >(
        cb: TCb
    ): IExecuteableQuery<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>], TCbResult[], AccumulateColumnParams<undefined, TCbResult>> {

        return new QueryBuilder<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>(this.dbType, this).select<TCb, TCbResult>(cb);
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
            { [K in keyof TInnerCols]: QueryColumn<TDbType, TInnerCols[K], { tableName: TInnerTableName, asTableName: undefined }> }
        > :
        TInnerJoinTable,

    >(
        type: JoinType,
        table: TInnerJoinTable,
        cb: (
            cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>, TInnerJoinResult]>>,
            ops: DbOperators<TDbType, false>
        ) => TCbResult
    ) {

        return new QueryBuilder<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>(this.dbType, this)
            .join(type, table, cb);
    }

    where<
        TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>
    >(cb: (
        cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>>,
        ops: DbOperators<TDbType, false>
    ) => TCbResult) {
        return new QueryBuilder<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>(this.dbType, this).where(cb);
    }


    groupBy<
        const TCbResult extends GroupBySpecs<TDbType>
    >(cb: (cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>>) => TCbResult) {
        return new QueryBuilder<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>(this.dbType, this).groupBy(cb);
    }

    orderBy<
        const  TCbResult extends OrderBySpecs<TDbType>
    >(cb: (cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>>) => TCbResult):
        ISelectClause<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>], AccumulateOrderByParams<TDbType, undefined, TCbResult>> {
        return new QueryBuilder<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>(this.dbType, this).orderBy(cb);
    }

}

export default QueryTable;