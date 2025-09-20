import { DbType } from "../db.js";
import QueryColumn, { type QueryColumnsObjectType } from "./queryColumn.js";
import type Table from "../table/table.js";
import { isNullOrUndefined } from "../utility/guards.js";
import type ColumnComparisonOperation from "./comparisons/_comparisonOperations.js";
import { IExecuteableQuery } from "./_interfaces/IExecuteableQuery.js";
import type ColumnLogicalOperation from "./logicalOperations.js";
import type { TablesToObject, TableToColumnsMap } from "./_types/miscellaneous.js";
import type { AccumulateColumnParams, AccumulateComparisonParams, AccumulateOrderByParams, ColumnsToResultMap, QueryParamsToObject, TResultShape } from "./_types/result.js";
import QueryTable from "./queryTable.js";
import type Column from "../table/column.js";
import type IJoinClause from "./_interfaces/IJoinClause.js";
import type ISelectClause from "./_interfaces/ISelectClause.js";
import type IWhereClause from "./_interfaces/IWhereClause.js";
import type IGroupByClause from "./_interfaces/IGroupByClause.js";
import type { DbFunctions, DbOperators } from "./_types/ops.js";
import type QueryParam from "./param.js";
import type { GroupedTablesToColumnsMap } from "./_types/grouping.js";
import type IHavingClause from "./_interfaces/IHavingClause.js";
import type { JoinType } from "./_interfaces/IJoinClause.js";
import type IOrderByClause from "./_interfaces/IOrderByClause.js";
import type { OrderBySpecs } from "./_interfaces/IOrderByClause.js";
import type { GroupBySpecs } from "./_interfaces/IGroupByClause.js";
import type { DbValueTypes } from "../table/column.js";

class QueryBuilder<
    TDbType extends DbType,
    TTables extends readonly QueryTable<TDbType, any, any, any, any, any>[],
    TResult extends TResultShape<TDbType>[] | TResultShape<TDbType> | undefined = undefined,
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null>[] | undefined = undefined,
    TGroupedColumns extends GroupBySpecs<TDbType> | undefined = undefined,
    TOrderBySpecs extends OrderBySpecs<TDbType> | undefined = undefined
>
    implements
    ISelectClause<TDbType, TTables, TParams, TGroupedColumns, TOrderBySpecs>,
    IJoinClause<TDbType, TTables, TParams>,
    IWhereClause<TDbType, TTables, TParams>,
    IGroupByClause<TDbType, TTables, TParams>,
    IHavingClause<TDbType, TTables, TParams, TGroupedColumns>,
    IOrderByClause<TDbType, TTables, TParams, TGroupedColumns>,
    IExecuteableQuery<TDbType, TTables, TResult, TParams> {

    colsSelection?: TResult;

    tables: TTables;


    constructor(tables: TTables, colsSelection?: TResult) {
        this.tables = tables;
        this.colsSelection = colsSelection;
    }

    select<
        TCb extends (
            cols: TGroupedColumns extends undefined ? TableToColumnsMap<TDbType, TablesToObject<TTables>> : GroupedTablesToColumnsMap<TDbType, TTables, TGroupedColumns>,
            ops: DbFunctions<TDbType, TGroupedColumns extends undefined ? false : true>
        ) => TResultShape<TDbType>,
        TCbResult extends TResultShape<TDbType> = TCb extends (cols: any, ops: any) => infer TR ? TR : never
    >(
        cb: TCb
    ): IExecuteableQuery<TDbType, TTables, TCbResult[], AccumulateColumnParams<TParams, TCbResult>, TGroupedColumns, TOrderBySpecs> {
        return new QueryBuilder(this.tables) as IExecuteableQuery<TDbType, TTables, TCbResult[], AccumulateColumnParams<TParams, TCbResult>, TGroupedColumns, TOrderBySpecs>;
    };


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
        cb: (cols: TableToColumnsMap<TDbType, TablesToObject<[...TTables, TInnerJoinResult]>>, ops: DbOperators<TDbType, false>) => TCbResult
    ):
        IJoinClause<TDbType, [...TTables, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>> &
        ISelectClause<TDbType, [...TTables, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>> &
        IWhereClause<TDbType, [...TTables, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>> &
        IGroupByClause<TDbType, [...TTables, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>> &
        IOrderByClause<TDbType, [...TTables, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>> {
        let innerJoinTable: TInnerJoinResult;
        if ("table" in table) {
            innerJoinTable = table as TInnerJoinResult;
        } else if ("name" in table) {

            const innerQueryColumns = Object.entries(table.columns).reduce((prev, curr) => {
                prev[curr[0]] = new QueryColumn(curr[1] as Column<TDbType, any, any, any>);
                return prev;
            }, {} as QueryColumnsObjectType<TDbType>);

            innerJoinTable = new QueryTable(table, innerQueryColumns) as TInnerJoinResult;
        } else {
            throw Error('Invalid inner join table type.');
        }

        const newTables = [...this.tables, innerJoinTable];

        return new QueryBuilder(newTables) as
            IJoinClause<TDbType, [...TTables, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>> &
            ISelectClause<TDbType, [...TTables, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>> &
            IWhereClause<TDbType, [...TTables, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>> &
            IGroupByClause<TDbType, [...TTables, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>> &
            IOrderByClause<TDbType, [...TTables, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>>
    }

    where<
        TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>
    >(cb: (
        cols: TableToColumnsMap<TDbType, TablesToObject<TTables>>,
        ops: DbOperators<TDbType, TGroupedColumns extends undefined ? false : true>
    ) => TCbResult):
        ISelectClause<TDbType, TTables, AccumulateComparisonParams<TParams, TCbResult>> &
        IGroupByClause<TDbType, TTables, AccumulateComparisonParams<TParams, TCbResult>> &
        IOrderByClause<TDbType, TTables, AccumulateComparisonParams<TParams, TCbResult>> {
        return new QueryBuilder(this.tables) as
            ISelectClause<TDbType, TTables, AccumulateComparisonParams<TParams, TCbResult>> &
            IGroupByClause<TDbType, TTables, AccumulateComparisonParams<TParams, TCbResult>> &
            IOrderByClause<TDbType, TTables, AccumulateComparisonParams<TParams, TCbResult>>;
    }

    groupBy<
        const TCbResult extends GroupBySpecs<TDbType>
    >(cb: (cols: TableToColumnsMap<TDbType, TablesToObject<TTables>>) => TCbResult) {
        return new QueryBuilder(this.tables) as
            ISelectClause<TDbType, TTables, TParams, TCbResult> &
            IHavingClause<TDbType, TTables, TParams, TCbResult> &
            IOrderByClause<TDbType, TTables, TParams, TCbResult>;
    }

    having<TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>
    >(cb: (
        cols: GroupedTablesToColumnsMap<TDbType, TTables, TGroupedColumns>,
        ops: DbOperators<TDbType, true>
    ) => TCbResult) {
        return new QueryBuilder(this.tables) as
            ISelectClause<TDbType, TTables, AccumulateComparisonParams<TParams, TCbResult>, TGroupedColumns> &
            IOrderByClause<TDbType, TTables, AccumulateComparisonParams<TParams, TCbResult>, TGroupedColumns>
    }

    orderBy<
        const TCbResult extends OrderBySpecs<TDbType>
    >(cb: (cols: TableToColumnsMap<TDbType, TablesToObject<TTables>>) => TCbResult) {
        return new QueryBuilder(this.tables) as ISelectClause<TDbType, TTables, AccumulateOrderByParams<TDbType, TParams, TCbResult>, TGroupedColumns, TCbResult>
    }

    exec(params?: QueryParamsToObject<TParams>):
        TResult extends TResultShape<TDbType>[] | TResultShape<TDbType> ?
        ColumnsToResultMap<TDbType, TResult> :
        never {
        if (isNullOrUndefined(this?.colsSelection)) {
            return {} as any;
        }

        return "x" as any;
    }
}

export {
    QueryBuilder
}