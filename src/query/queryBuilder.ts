import { DbType, dbTypes } from "../db.js";
import QueryColumn from "./queryColumn.js";
import Table, { type MapToQueryColumns } from "../table/table.js";
import { isNullOrUndefined } from "../utility/guards.js";
import type ColumnComparisonOperation from "./comparisons/_comparisonOperations.js";
import { IExecuteableQuery } from "./_interfaces/IExecuteableQuery.js";
import type ColumnLogicalOperation from "./logicalOperations.js";
import type { TablesToObject, TableToColumnsMap } from "./_types/miscellaneous.js";
import type { ColumnsToResultMap, QueryParamsToObject, ResultShape, ResultShapeItem } from "./_types/result.js";
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
import type { AccumulateSubQueryParams, ConvertComparableIdsOfSelectResult, ConvertTablesToQueryTables, InferDbTypeFromFromFirstIDbType, SetComparableIdsOfSubQueries } from "./_types/subQueryUtility.js";
import type { AccumulateComparisonParams } from "./_types/paramAccumulationComparison.js";
import type { AccumulateOrderByParams } from "./_types/paramAccumulationOrderBy.js";
import type { AccumulateColumnParams } from "./_types/paramAccumulationSelect.js";
import type ColumnsSelection from "./columnsSelection.js";
import { columnsSelectionFactory } from "./columnsSelection.js";
import type { IComparable } from "./_interfaces/IComparable.js";
import { mysqlFunctions, mysqlFunctionsWithAggregation, pgFunctions, pgFunctionsWithAggregation } from "./dbOperations.js";

type JoinSpecsType<TDbType extends DbType> = readonly { joinType: JoinType, table: QueryTable<TDbType, any, any, any, any, any> | IExecuteableQuery<TDbType, any, any, any, any, any, any, any> }[]
type FromType<TDbType extends DbType> = readonly (QueryTable<TDbType, any, any, any, any, any> | IExecuteableQuery<TDbType, any, any, any, any, any, any, any>)[];
type ColumnsSelectionListType<TDbType extends DbType> = { [key: string]: ColumnsSelection<TDbType, any, any> }


class QueryBuilder<
    TDbType extends DbType,
    TFrom extends FromType<TDbType>,
    TJoinSpecs extends JoinSpecsType<TDbType> | undefined,
    TResult extends ResultShape<TDbType> | undefined = undefined,
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null, any, any, any>[] | undefined = undefined,
    TGroupedColumns extends GroupBySpecs<TDbType> | undefined = undefined,
    TOrderBySpecs extends OrderBySpecs<TDbType> | undefined = undefined,
    TAs extends string | undefined = undefined
>
    implements
    IDbType<TDbType>,
    ISelectClause<TDbType, TFrom, TJoinSpecs, TParams, TGroupedColumns, TOrderBySpecs>,
    IJoinClause<TDbType, TFrom, TJoinSpecs, TParams>,
    IWhereClause<TDbType, TFrom, TJoinSpecs, TParams>,
    IGroupByClause<TDbType, TFrom, TJoinSpecs, TParams>,
    IHavingClause<TDbType, TFrom, TJoinSpecs, TParams, TGroupedColumns>,
    IOrderByClause<TDbType, TFrom, TJoinSpecs, TParams, TGroupedColumns> {

    dbType: TDbType;

    asName?: TAs;


    from: FromType<TDbType>;
    joinSpecs?: TJoinSpecs;
    columnsSelectionList?: ColumnsSelectionListType<TDbType>;
    resultSelection?: TResult;
    groupedColumns?: TGroupedColumns;

    constructor(
        dbType: TDbType,
        from: FromType<TDbType>,
        data?: {
            asName: TAs,
            joinSpecs?: TJoinSpecs,
            resultSelection?: TResult,
            columnsSelectionList?: ColumnsSelectionListType<TDbType>
            groupedColumns?: TGroupedColumns
        }
    ) {
        this.dbType = dbType;

        this.from = from;
        this.joinSpecs = data?.joinSpecs;
        this.resultSelection = data?.resultSelection;
        this.columnsSelectionList = data?.columnsSelectionList;
        this.groupedColumns = data?.groupedColumns;

        this.asName = data?.asName;
    }

    as<TAs extends string>(asName: TAs) {
        return new QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TResult,
            TParams,
            TGroupedColumns,
            TOrderBySpecs,
            TAs
        >(this.dbType, this.from, { asName, resultSelection: this.resultSelection, joinSpecs: this.joinSpecs })
    }

    select<
        const TCbResult extends ResultShape<TDbType>
    >(
        cb: (
            cols: TGroupedColumns extends undefined ? TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>> : GroupedTablesToColumnsMap<TDbType, TFrom, TJoinSpecs, TGroupedColumns>,
            ops: DbFunctions<TDbType, TGroupedColumns extends undefined ? false : true>
        ) => TCbResult
    ): IExecuteableQuery<TDbType, TFrom, TJoinSpecs, TCbResult, AccumulateColumnParams<TParams, TCbResult>, TGroupedColumns, TOrderBySpecs> {

        const cols = this.columnsSelectionList as TGroupedColumns extends undefined ? TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>> : GroupedTablesToColumnsMap<TDbType, TFrom, TJoinSpecs, TGroupedColumns>;
        let isAgg = false;
        if (this.groupedColumns && this.groupedColumns.length > 0) {
            isAgg = true
        }

        let functions;
        if (this.dbType === dbTypes.postgresql && isAgg === true) {
            functions = pgFunctionsWithAggregation;
        } else if (this.dbType === dbTypes.postgresql && isAgg === false) {
            functions = pgFunctions;
        } else if (this.dbType === dbTypes.mysql && isAgg === true) {
            functions = mysqlFunctionsWithAggregation;
        } else if (this.dbType === dbTypes.mysql && isAgg === false) {
            functions = mysqlFunctions;
        } else {
            throw Error('Invalid query specification.');
        }

        const selectRes = cb(cols, functions as DbFunctions<TDbType, TGroupedColumns extends undefined ? false : true>);

        return new QueryBuilder(
            this.dbType,
            this.from,
            {
                asName: this.asName,
                columnsSelectionList: this.columnsSelectionList,
                groupedColumns: this.groupedColumns,
                joinSpecs: this.joinSpecs,
                resultSelection: selectRes
            }) as IExecuteableQuery<TDbType, TFrom, TJoinSpecs, TCbResult, AccumulateColumnParams<TParams, TCbResult>, TGroupedColumns, TOrderBySpecs>;
    };


    join<
        TJoinType extends JoinType,
        TInnerJoinTable extends Table<TDbType, any, any> | QueryTable<TDbType, any, any, any, any, any> | IExecuteableQuery<TDbType, any, any, any, any, any, any, string>,
        TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>,
        TInnerJoinResult extends QueryTable<TDbType, any, any, any, any, any> | IExecuteableQuery<TDbType, any, any, any, any, any, any, string> =
        TInnerJoinTable extends Table<TDbType, infer TInnerCols, infer TInnerTableName> ?
        QueryTable<
            TDbType,
            TInnerCols,
            TInnerTableName,
            Table<TDbType, TInnerCols, TInnerTableName>,
            MapToQueryColumns<TDbType, TDbType, TInnerCols>
        > :
        TInnerJoinTable extends IExecuteableQuery<TDbType, any, any, any, any, any, any, string> ? ConvertComparableIdsOfSelectResult<TDbType, TInnerJoinTable> :
        TInnerJoinTable,
        const TInnerJoinAccumulated extends JoinSpecsType<TDbType> = readonly [...(TJoinSpecs extends undefined ? [] : TJoinSpecs), { joinType: TJoinType, table: TInnerJoinResult }],
        TAccumulatedParams extends QueryParam<TDbType, any, any, any, any, any>[] = AccumulateSubQueryParams<TDbType, [TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>>,
        TAccumulatedParamsResult extends QueryParam<TDbType, any, any, any, any, any>[] | undefined = TAccumulatedParams["length"] extends 0 ? undefined : TAccumulatedParams
    >(
        type: TJoinType,
        table: TInnerJoinTable,
        cb: (cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TInnerJoinAccumulated>>, ops: DbOperators<TDbType, false>) => TCbResult
    ):

        IJoinClause<TDbType, TFrom, TInnerJoinAccumulated, TAccumulatedParamsResult> &
        ISelectClause<TDbType, TFrom, TInnerJoinAccumulated, TAccumulatedParamsResult> &
        IWhereClause<TDbType, TFrom, TInnerJoinAccumulated, TAccumulatedParamsResult> &
        IGroupByClause<TDbType, TFrom, TInnerJoinAccumulated, TAccumulatedParamsResult> &
        IOrderByClause<TDbType, TFrom, TInnerJoinAccumulated, TAccumulatedParamsResult> {

        let columnsSelectionList = this.columnsSelectionList;

        let joinTable: TInnerJoinResult;
        if (table instanceof Table) {
            const queryColumns = table.columnsList.map((col: Column<TDbType, any, any, any, any, any, any>) => {
                return new QueryColumn(table.dbType, col);
            }) as QueryColumn<TDbType, any, any, any, any, any, any>[];

            let res = new QueryTable(table.dbType, table, queryColumns);
            let ownerName = res.asName ? res.asName : res.table.name;
            let columnsSelection = columnsSelectionFactory<TDbType>(res, res.columnsList.map(c => c.setOwnerName(ownerName)));

            joinTable = res as TInnerJoinResult;
            columnsSelectionList = {
                ...columnsSelectionList,
                [ownerName]: columnsSelection
            }
        } else if (table instanceof QueryTable) {
            joinTable = table as QueryTable<TDbType, any, any, any, any, any> as TInnerJoinResult;
            let ownerName = table.asName ? table.asName : table.table.name;
            let columnsSelection = columnsSelectionFactory<TDbType>(table, table.columnsList.map((c: QueryColumn<TDbType, any, any, any, any, any, any, any>) => c.setOwnerName(ownerName)))

            columnsSelectionList = {
                ...columnsSelectionList,
                [ownerName]: columnsSelection
            }
        } else if (table instanceof QueryBuilder) {
            joinTable = table as IExecuteableQuery<TDbType, any, any, any, any, any, any, any> as TInnerJoinResult;

            if (typeof table.asName !== "string") {
                throw Error("Subquery alias must be provided.");
            }

            let ownerName = table.asName;
            let columnsSelection = columnsSelectionFactory<TDbType>(table, table.resultSelection.map((c: ResultShapeItem<TDbType>) => c.setOwnerName(ownerName)))

            columnsSelectionList = {
                ...columnsSelectionList,
                [ownerName]: columnsSelection
            }
        } else {
            throw Error('Invalid table type.');
        }

        const newJoinSpec = { joinType: type, table: joinTable };
        const mergedJoinSpecs = [...(this.joinSpecs === undefined ? [newJoinSpec] : [...this.joinSpecs, newJoinSpec])] as TInnerJoinAccumulated;

        return new QueryBuilder(this.dbType, this.from, {
            joinSpecs: mergedJoinSpecs,
            resultSelection: this.resultSelection,
            columnsSelectionList: columnsSelectionList,
            asName: this.asName
        }) as
            IJoinClause<TDbType, TFrom, TInnerJoinAccumulated, TAccumulatedParamsResult> &
            ISelectClause<TDbType, TFrom, TInnerJoinAccumulated, TAccumulatedParamsResult> &
            IWhereClause<TDbType, TFrom, TInnerJoinAccumulated, TAccumulatedParamsResult> &
            IGroupByClause<TDbType, TFrom, TInnerJoinAccumulated, TAccumulatedParamsResult> &
            IOrderByClause<TDbType, TFrom, TInnerJoinAccumulated, TAccumulatedParamsResult>
    }

    where<
        TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>
    >(cb: (
        cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>,
        ops: DbOperators<TDbType, TGroupedColumns extends undefined ? false : true>
    ) => TCbResult):
        ISelectClause<TDbType, TFrom, TJoinSpecs, AccumulateComparisonParams<TParams, TCbResult>> &
        IGroupByClause<TDbType, TFrom, TJoinSpecs, AccumulateComparisonParams<TParams, TCbResult>> &
        IOrderByClause<TDbType, TFrom, TJoinSpecs, AccumulateComparisonParams<TParams, TCbResult>> {
        return new QueryBuilder(this.dbType, this.from) as
            ISelectClause<TDbType, TFrom, TJoinSpecs, AccumulateComparisonParams<TParams, TCbResult>> &
            IGroupByClause<TDbType, TFrom, TJoinSpecs, AccumulateComparisonParams<TParams, TCbResult>> &
            IOrderByClause<TDbType, TFrom, TJoinSpecs, AccumulateComparisonParams<TParams, TCbResult>>;
    }

    groupBy<
        const TCbResult extends GroupBySpecs<TDbType>,
        TCols extends TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>
    >(cb: (
        cols: TCols,
        ops: DbFunctions<TDbType, false>
    ) => TCbResult) {

        if (isNullOrUndefined(this.columnsSelectionList)) {
            throw Error("No query object provided.");
        }

        const functions = this.dbType === dbTypes.postgresql ? pgFunctions : this.dbType === dbTypes.mysql ? mysqlFunctions : undefined;
        if (isNullOrUndefined(functions)) {
            throw Error('Invalid db type.');
        }
        const res = cb(this.columnsSelectionList as TCols, functions as DbFunctions<TDbType, false>);

        return new QueryBuilder(
            this.dbType,
            this.from,
            {
                asName: this.asName,
                columnsSelectionList: this.columnsSelectionList,
                groupedColumns: res,
                joinSpecs: this.joinSpecs,
                resultSelection: this.resultSelection
            }) as
            ISelectClause<TDbType, TFrom, TJoinSpecs, TParams, TCbResult> &
            IHavingClause<TDbType, TFrom, TJoinSpecs, TParams, TCbResult> &
            IOrderByClause<TDbType, TFrom, TJoinSpecs, TParams, TCbResult>;
    }

    having<TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>
    >(cb: (
        cols: GroupedTablesToColumnsMap<TDbType, TFrom, TJoinSpecs, TGroupedColumns>,
        ops: DbOperators<TDbType, true>
    ) => TCbResult) {
        return new QueryBuilder(this.dbType, this.from) as
            ISelectClause<TDbType, TFrom, TJoinSpecs, AccumulateComparisonParams<TParams, TCbResult>, TGroupedColumns> &
            IOrderByClause<TDbType, TFrom, TJoinSpecs, AccumulateComparisonParams<TParams, TCbResult>, TGroupedColumns>
    }

    orderBy<
        const TCbResult extends OrderBySpecs<TDbType>
    >(cb: (cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>) => TCbResult) {
        return new QueryBuilder(this.dbType, this.from) as ISelectClause<TDbType, TFrom, TJoinSpecs, AccumulateOrderByParams<TDbType, TParams, TCbResult>, TGroupedColumns, TCbResult>
    }

    exec(
        ...args: TParams extends undefined
            ? []
            : [params: QueryParamsToObject<TParams>]
    ):
        TResult extends ResultShape<TDbType> ?
        ColumnsToResultMap<TDbType, TResult> :
        never {

        const params = args[0];

        if (isNullOrUndefined(this?.resultSelection)) {
            return {} as any;
        }

        return "x" as any;
    }
}



function from<
    TFrom extends readonly (
        Table<TDbType, any, any> |
        QueryTable<TDbType, any, any, any, any, any> |
        IExecuteableQuery<TDbType, any, any, any, any, any, any, string>
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

export type {
    JoinSpecsType,
    FromType
}
