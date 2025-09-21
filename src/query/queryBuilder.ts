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
import type { IDbType } from "./_interfaces/IDbType.js";

type FromType<TDbType extends DbType> = QueryTable<TDbType, any, any, any, any, any> |
    QueryBuilder<TDbType, any, any, any, any, any, any> |
    readonly (QueryTable<TDbType, any, any, any, any, any> | QueryBuilder<TDbType, any, any, any, any, any, any>)[]


class QueryBuilder<
    TDbType extends DbType,
    TQueryItems extends readonly (QueryTable<TDbType, any, any, any, any, any> | QueryBuilder<TDbType, any, any, any, any, any, any>)[],
    TResult extends TResultShape<TDbType>[] | TResultShape<TDbType> | undefined = undefined,
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null>[] | undefined = undefined,
    TGroupedColumns extends GroupBySpecs<TDbType> | undefined = undefined,
    TOrderBySpecs extends OrderBySpecs<TDbType> | undefined = undefined,
    TAs extends string | undefined = undefined
>
    implements
    IDbType<TDbType>,
    ISelectClause<TDbType, TQueryItems, TParams, TGroupedColumns, TOrderBySpecs>,
    IJoinClause<TDbType, TQueryItems, TParams>,
    IWhereClause<TDbType, TQueryItems, TParams>,
    IGroupByClause<TDbType, TQueryItems, TParams>,
    IHavingClause<TDbType, TQueryItems, TParams, TGroupedColumns>,
    IOrderByClause<TDbType, TQueryItems, TParams, TGroupedColumns> {

    dbType: TDbType;

    asName?: TAs;

    colsSelection?: TResult;

    queryItems: TQueryItems;

    from: FromType<TDbType>

    constructor(dbType: TDbType, from: FromType<TDbType>, data?: { asName: TAs, colsSelection?: TResult }) {
        this.dbType = dbType;
        this.from = from;

        this.queryItems = (Array.isArray(from) ? [...from] as const : [from]) as TQueryItems;

        this.colsSelection = data?.colsSelection;
        this.asName = data?.asName;
    }

    as<TAs extends string>(asName: TAs) {
        return new QueryBuilder<
            TDbType,
            TQueryItems,
            TResult,
            TParams,
            TGroupedColumns,
            TOrderBySpecs,
            TAs
        >(this.dbType, this.from, { asName, colsSelection: this.colsSelection })
    }

    select<
        TCb extends (
            cols: TGroupedColumns extends undefined ? TableToColumnsMap<TDbType, TablesToObject<TDbType, TQueryItems>> : GroupedTablesToColumnsMap<TDbType, TQueryItems, TGroupedColumns>,
            ops: DbFunctions<TDbType, TGroupedColumns extends undefined ? false : true>
        ) => TResultShape<TDbType>,
        TCbResult extends TResultShape<TDbType> = TCb extends (cols: any, ops: any) => infer TR ? TR : never
    >(
        cb: TCb
    ): IExecuteableQuery<TDbType, TQueryItems, TCbResult[], AccumulateColumnParams<TParams, TCbResult>, TGroupedColumns, TOrderBySpecs> {
        return new QueryBuilder(this.dbType, this.from) as IExecuteableQuery<TDbType, TQueryItems, TCbResult[], AccumulateColumnParams<TParams, TCbResult>, TGroupedColumns, TOrderBySpecs>;
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
        cb: (cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, [...TQueryItems, TInnerJoinResult]>>, ops: DbOperators<TDbType, false>) => TCbResult
    ):
        IJoinClause<TDbType, [...TQueryItems, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>> &
        ISelectClause<TDbType, [...TQueryItems, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>> &
        IWhereClause<TDbType, [...TQueryItems, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>> &
        IGroupByClause<TDbType, [...TQueryItems, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>> &
        IOrderByClause<TDbType, [...TQueryItems, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>> {
        let innerJoinTable: TInnerJoinResult;
        if ("table" in table) {
            innerJoinTable = table as TInnerJoinResult;
        } else if ("name" in table) {

            const innerQueryColumns = Object.entries(table.columns).reduce((prev, curr) => {
                prev[curr[0]] = new QueryColumn(this.dbType, curr[1] as Column<TDbType, any, any, any>);
                return prev;
            }, {} as QueryColumnsObjectType<TDbType>);

            innerJoinTable = new QueryTable(this.dbType, table, innerQueryColumns) as TInnerJoinResult;
        } else {
            throw Error('Invalid inner join table type.');
        }

        // const newTables = [...this.tables, innerJoinTable];

        return new QueryBuilder(this.dbType, this.from) as
            IJoinClause<TDbType, [...TQueryItems, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>> &
            ISelectClause<TDbType, [...TQueryItems, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>> &
            IWhereClause<TDbType, [...TQueryItems, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>> &
            IGroupByClause<TDbType, [...TQueryItems, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>> &
            IOrderByClause<TDbType, [...TQueryItems, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>>
    }

    where<
        TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>
    >(cb: (
        cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, TQueryItems>>,
        ops: DbOperators<TDbType, TGroupedColumns extends undefined ? false : true>
    ) => TCbResult):
        ISelectClause<TDbType, TQueryItems, AccumulateComparisonParams<TParams, TCbResult>> &
        IGroupByClause<TDbType, TQueryItems, AccumulateComparisonParams<TParams, TCbResult>> &
        IOrderByClause<TDbType, TQueryItems, AccumulateComparisonParams<TParams, TCbResult>> {
        return new QueryBuilder(this.dbType, this.from) as
            ISelectClause<TDbType, TQueryItems, AccumulateComparisonParams<TParams, TCbResult>> &
            IGroupByClause<TDbType, TQueryItems, AccumulateComparisonParams<TParams, TCbResult>> &
            IOrderByClause<TDbType, TQueryItems, AccumulateComparisonParams<TParams, TCbResult>>;
    }

    groupBy<
        const TCbResult extends GroupBySpecs<TDbType>
    >(cb: (cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, TQueryItems>>) => TCbResult) {
        return new QueryBuilder(this.dbType, this.from) as
            ISelectClause<TDbType, TQueryItems, TParams, TCbResult> &
            IHavingClause<TDbType, TQueryItems, TParams, TCbResult> &
            IOrderByClause<TDbType, TQueryItems, TParams, TCbResult>;
    }

    having<TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>
    >(cb: (
        cols: GroupedTablesToColumnsMap<TDbType, TQueryItems, TGroupedColumns>,
        ops: DbOperators<TDbType, true>
    ) => TCbResult) {
        return new QueryBuilder(this.dbType, this.from) as
            ISelectClause<TDbType, TQueryItems, AccumulateComparisonParams<TParams, TCbResult>, TGroupedColumns> &
            IOrderByClause<TDbType, TQueryItems, AccumulateComparisonParams<TParams, TCbResult>, TGroupedColumns>
    }

    orderBy<
        const TCbResult extends OrderBySpecs<TDbType>
    >(cb: (cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, TQueryItems>>) => TCbResult) {
        return new QueryBuilder(this.dbType, this.from) as ISelectClause<TDbType, TQueryItems, AccumulateOrderByParams<TDbType, TParams, TCbResult>, TGroupedColumns, TCbResult>
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

export default QueryBuilder;
