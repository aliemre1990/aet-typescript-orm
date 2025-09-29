import { DbType } from "../db.js";
import QueryColumn, { type QueryColumnsObjectType } from "./queryColumn.js";
import Table, { type MapToQueryColumns } from "../table/table.js";
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
import type { ColumnType, DbValueTypes } from "../table/column.js";
import type { IDbType } from "./_interfaces/IDbType.js";
import type { IComparable } from "./_interfaces/IComparable.js";
import type { AccumulateSubQueryParams, ConvertTablesToQueryTables, InferDbTypeFromFromFirstIDbType, SetComparableIdsOfSubQueries } from "./_types/subQueryUtility.js";

type FromType<TDbType extends DbType> =
    QueryTable<TDbType, any, any, any, any, any> |
    IExecuteableQuery<TDbType, any, any, any, any, any, any> |
    readonly (QueryTable<TDbType, any, any, any, any, any> | IExecuteableQuery<TDbType, any, any, any, any, any, any>)[]


class QueryBuilder<
    TDbType extends DbType,
    TQueryItems extends readonly (QueryTable<TDbType, any, any, any, any, any> | IExecuteableQuery<TDbType, any, any, any, any, any, any>)[],
    TResult extends TResultShape<TDbType> | undefined = undefined,
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null, any, any, any>[] | undefined = undefined,
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
        const TCbResult extends TResultShape<TDbType>
    >(
        cb: (
            cols: TGroupedColumns extends undefined ? TableToColumnsMap<TDbType, TablesToObject<TDbType, TQueryItems>> : GroupedTablesToColumnsMap<TDbType, TQueryItems, TGroupedColumns>,
            ops: DbFunctions<TDbType, TGroupedColumns extends undefined ? false : true>
        ) => TCbResult
    ): IExecuteableQuery<TDbType, TQueryItems, TCbResult, AccumulateColumnParams<TParams, TCbResult>, TGroupedColumns, TOrderBySpecs> {
        return new QueryBuilder(this.dbType, this.from) as IExecuteableQuery<TDbType, TQueryItems, TCbResult, AccumulateColumnParams<TParams, TCbResult>, TGroupedColumns, TOrderBySpecs>;
    };


    join<
        TInnerJoinTable extends Table<TDbType, any, any> | QueryTable<TDbType, any, any, any, any, any> | IExecuteableQuery<TDbType, any, any, any, any, any, string>,
        TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>,
        TInnerJoinResult extends QueryTable<TDbType, any, any, any, any, any> | IExecuteableQuery<TDbType, any, any, any, any, any, any> = TInnerJoinTable extends Table<TDbType, infer TInnerCols, infer TInnerTableName> ?
        QueryTable<
            TDbType,
            TInnerCols,
            TInnerTableName,
            Table<TDbType, TInnerCols, TInnerTableName>,
            MapToQueryColumns<TDbType, TInnerCols>
        > :
        TInnerJoinTable,
        TAccumulatedParams extends QueryParam<TDbType, any, any, any, any, any>[] = AccumulateSubQueryParams<TDbType, [TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>>,
        TAccumulatedParamsResult extends QueryParam<TDbType, any, any, any, any, any>[] | undefined = TAccumulatedParams["length"] extends 0 ? undefined : TAccumulatedParams
    >(
        type: JoinType,
        table: TInnerJoinTable,
        cb: (cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, [...TQueryItems, TInnerJoinResult]>>, ops: DbOperators<TDbType, false>) => TCbResult
    ):

        IJoinClause<TDbType, [...TQueryItems, TInnerJoinResult], TAccumulatedParamsResult> &
        ISelectClause<TDbType, [...TQueryItems, TInnerJoinResult], TAccumulatedParamsResult> &
        IWhereClause<TDbType, [...TQueryItems, TInnerJoinResult], TAccumulatedParamsResult> &
        IGroupByClause<TDbType, [...TQueryItems, TInnerJoinResult], TAccumulatedParamsResult> &
        IOrderByClause<TDbType, [...TQueryItems, TInnerJoinResult], TAccumulatedParamsResult> {
        let innerJoinTable: TInnerJoinResult;
        if ("table" in table) {
            innerJoinTable = table as TInnerJoinResult;
        } else if ("name" in table) {
            const innerQueryColumns = table.columnsList.map((col: Column<TDbType, any, any, any, any, any, any>) => {
                return new QueryColumn(this.dbType, col);
            }) as QueryColumn<TDbType, any, any, any, any, any, any>[];

            innerJoinTable = new QueryTable(this.dbType, table, innerQueryColumns) as TInnerJoinResult;
        } else {
            throw Error('Invalid inner join table type.');
        }

        // const newTables = [...this.tables, innerJoinTable];

        return new QueryBuilder(this.dbType, this.from) as
            IJoinClause<TDbType, [...TQueryItems, TInnerJoinResult], TAccumulatedParamsResult> &
            ISelectClause<TDbType, [...TQueryItems, TInnerJoinResult], TAccumulatedParamsResult> &
            IWhereClause<TDbType, [...TQueryItems, TInnerJoinResult], TAccumulatedParamsResult> &
            IGroupByClause<TDbType, [...TQueryItems, TInnerJoinResult], TAccumulatedParamsResult> &
            IOrderByClause<TDbType, [...TQueryItems, TInnerJoinResult], TAccumulatedParamsResult>
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
    >(cb: (
        cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, TQueryItems>>,
        ops: DbFunctions<TDbType, false>
    ) => TCbResult) {
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

    exec(
        ...args: TParams extends undefined
            ? []
            : [params: QueryParamsToObject<TParams>]
    ):
        TResult extends TResultShape<TDbType> ?
        ColumnsToResultMap<TDbType, TResult> :
        never {

        const params = args[0];

        if (isNullOrUndefined(this?.colsSelection)) {
            return {} as any;
        }

        return "x" as any;
    }
}



function from<
    TFrom extends readonly (
        Table<TDbType, any, any> |
        QueryTable<TDbType, any, any, any, any, any> |
        IExecuteableQuery<TDbType, any, any, any, any, any, string>
    )[],
    TDbType extends DbType = InferDbTypeFromFromFirstIDbType<TFrom>
>(...from: TFrom) {

    type TFromRes = ConvertTablesToQueryTables<TFrom>;

    let dbType = from[0].dbType as TDbType;

    const fromResult = from.map(item => {
        if (item instanceof Table) {


            const queryColumns = item.columnsList.map((col: Column<TDbType, any, any, any, any, any, any>) => {
                return new QueryColumn(item.dbType, col);
            }) as QueryColumn<TDbType, any, any, any, any, any, any>[];

            return new QueryTable(item.dbType, item, queryColumns);
        } else {
            return item;
        }
    }) as TFromRes;

    type AccumulatedParams = AccumulateSubQueryParams<TDbType, TFromRes>;
    type AccumulatedParamsResult = AccumulatedParams["length"] extends 0 ? undefined : AccumulatedParams;

    return new QueryBuilder<TDbType, SetComparableIdsOfSubQueries<TDbType, TFromRes>, undefined, AccumulatedParamsResult>(dbType, fromResult);
}



export default QueryBuilder;

export {
    from
}
