import { DbType, type PgDbType } from "../db.js";
import type { PgValueTypes } from "../postgresql/dataTypes.js";
import QueryColumn, { type QueryParam } from "./queryColumn.js";
import type Table from "../table/table.js";
import type { QueryColumnsObjectType } from "../table/types/utils.js";
import type { JoinType } from "../types.js";
import { isNullOrUndefined } from "../utility/guards.js";
import type ColumnComparisonOperation from "./comparisons/_comparisonOperations.js";
import { IExecuteableQuery } from "./_interfaces/IExecuteableQuery.js";
import type ColumnLogicalOperation from "./logicalOperations.js";
import type { TablesToObject, TableToColumnsMap } from "./_types/miscellaneous.js";
import type { AccumulateParams, ColumnsToResultMap, QueryParamsToObject, TablesToGroupedResultMap, TablesToResultMap, TResultShape } from "./_types/result.js";
import QueryTable from "./queryTable.js";
import type Column from "../table/column.js";
import type IJoinClause from "./_interfaces/IJoinClause.js";
import type ISelectClause from "./_interfaces/ISelectClause.js";
import type IWhereClause from "./_interfaces/IWhereClause.js";
import type IGroupByClause from "./_interfaces/IGroupByClause.js";
import type { TablesToColumnsMapFormatGroupedColumns } from "./_types/grouping.js";
import type { DbFunctions, DbOperators } from "./_types/ops.js";

class QueryBuilder<
    TDbType extends DbType,
    TTables extends QueryTable<TDbType, any, any, any, any, any>[],
    TResult extends TResultShape<TDbType> | undefined = undefined,
    TParams extends QueryParam<TDbType, string, TDbType extends PgDbType ? PgValueTypes : never>[] | undefined = undefined,
    TGroupedColumns extends ({ [key: string]: QueryColumn<TDbType, any, any, any> } | QueryColumn<TDbType, any, any, any>)[] | undefined = undefined,
>
    implements
    ISelectClause<TDbType, TTables, TParams, TGroupedColumns>,
    IJoinClause<TDbType, TTables, TParams>,
    IWhereClause<TDbType, TTables, TParams>,
    IGroupByClause<TDbType, TTables, TParams> {

    colsSelection?: TResult;

    tables: TTables;


    constructor(tables: TTables, colsSelection?: TResult) {
        this.tables = tables;
        this.colsSelection = colsSelection;
    }

    select<TCb extends undefined>():
        IExecuteableQuery<TDbType, TTables, TCb extends (cols: any) => infer TR ? TR : undefined, TParams, TGroupedColumns>
    select<TCb extends (
        cols: TGroupedColumns extends undefined ? TableToColumnsMap<TablesToObject<TTables>> : TablesToColumnsMapFormatGroupedColumns<TTables, TGroupedColumns>,
        ops: DbFunctions<TDbType>
    ) => TResultShape<TDbType>
    >(cb: TCb | undefined):
        IExecuteableQuery<TDbType, TTables, TCb extends (cols: any) => infer TR ? TR : undefined, TParams, TGroupedColumns>
    select<
        TCb extends (
            cols: TGroupedColumns extends undefined ? TableToColumnsMap<TablesToObject<TTables>> : TablesToColumnsMapFormatGroupedColumns<TTables, TGroupedColumns>,
            ops: DbFunctions<TDbType>
        ) => TResultShape<TDbType>
    >(
        cb?: TCb
    ): IExecuteableQuery<TDbType, TTables, TCb extends (cols: any) => infer TR ? TR : undefined, TParams, TGroupedColumns> {
        return this as unknown as IExecuteableQuery<TDbType, TTables, TCb extends (cols: any) => infer TR ? TR : undefined, TParams, TGroupedColumns>;
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
        cb: (cols: TableToColumnsMap<TablesToObject<[...TTables, TInnerJoinResult]>>, ops: DbOperators<TDbType>) => TCbResult
    ):
        IJoinClause<TDbType, [...TTables, TInnerJoinResult], AccumulateParams<TParams, TCbResult>> &
        ISelectClause<TDbType, [...TTables, TInnerJoinResult], AccumulateParams<TParams, TCbResult>> &
        IWhereClause<TDbType, [...TTables, TInnerJoinResult], AccumulateParams<TParams, TCbResult>> &
        IGroupByClause<TDbType, [...TTables, TInnerJoinResult], AccumulateParams<TParams, TCbResult>> {
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
            IJoinClause<TDbType, [...TTables, TInnerJoinResult], AccumulateParams<TParams, TCbResult>> &
            ISelectClause<TDbType, [...TTables, TInnerJoinResult], AccumulateParams<TParams, TCbResult>> &
            IWhereClause<TDbType, [...TTables, TInnerJoinResult], AccumulateParams<TParams, TCbResult>> &
            IGroupByClause<TDbType, [...TTables, TInnerJoinResult], AccumulateParams<TParams, TCbResult>>
    }

    where<
        TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>
    >(cb: (
        cols: TableToColumnsMap<TablesToObject<TTables>>,
        ops: DbOperators<TDbType>
    ) => TCbResult):
        ISelectClause<TDbType, TTables, AccumulateParams<TParams, TCbResult>> {
        return this as ISelectClause<TDbType, TTables, AccumulateParams<TParams, TCbResult>>;
    }

    groupBy<const TCbResult extends ({ [key: string]: QueryColumn<TDbType, any, any, any> } | QueryColumn<TDbType, any, any, any>)[]
    >(cb: (cols: TableToColumnsMap<TablesToObject<TTables>>) => TCbResult) {
        return this as ISelectClause<TDbType, TTables, TParams, TCbResult>
    }



    exec(params?: QueryParamsToObject<TParams>):
        TResult extends undefined ?
        TGroupedColumns extends undefined ?
        TablesToResultMap<TDbType, TTables> :
        TablesToGroupedResultMap<TDbType, TTables, TGroupedColumns> :
        TResult extends TResultShape<TDbType> ?
        ColumnsToResultMap<TDbType, TResult> :
        never {
        if (isNullOrUndefined(this?.colsSelection)) {
            return {} as any;
        }

        return Object.keys(this.colsSelection).reduce((prev, curr) => { prev[curr] = 1; return prev; }, {} as any);
    }
}

export {
    QueryBuilder
}