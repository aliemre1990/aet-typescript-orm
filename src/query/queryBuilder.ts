import { DbType, type DbValueTypes, type PgDbType } from "../db.js";
import type { PgValueTypes } from "../postgresql/dataTypes.js";
import QueryColumn, { type ColumnsSelection } from "./queryColumn.js";
import type Table from "../table/table.js";
import type { QueryColumnsObjectType } from "../table/types/utils.js";
import type { JoinType } from "../types.js";
import { isNullOrUndefined } from "../utility/guards.js";
import type ColumnComparisonOperation from "./comparisons/_comparisonOperations.js";
import { IExecuteableQuery } from "./_interfaces/IExecuteableQuery.js";
import type ColumnLogicalOperation from "./logicalOperations.js";
import type { TablesToObject, TableToColumnsMap } from "./_types/miscellaneous.js";
import type { AccumulateColumnParams, AccumulateComparisonParams, ColumnsToResultMap, QueryParamsToObject, TResultShape } from "./_types/result.js";
import QueryTable from "./queryTable.js";
import type Column from "../table/column.js";
import type IJoinClause from "./_interfaces/IJoinClause.js";
import type ISelectClause from "./_interfaces/ISelectClause.js";
import type IWhereClause from "./_interfaces/IWhereClause.js";
import type IGroupByClause from "./_interfaces/IGroupByClause.js";
import type { TablesToColumnsMapFormatGroupedColumns } from "./_types/grouping.js";
import type { DbFunctions, DbOperators } from "./_types/ops.js";
import type QueryParam from "./param.js";

class QueryBuilder<
    TDbType extends DbType,
    TTables extends readonly QueryTable<TDbType, any, any, any, any, any>[],
    TResult extends TResultShape<TDbType> | undefined = undefined,
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null>[] | undefined = undefined,
    TGroupedColumns extends (ColumnsSelection<TDbType, any> | QueryColumn<TDbType, any, any, any>)[] | undefined = undefined,
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

    select<
        TCb extends (
            cols: TGroupedColumns extends undefined ? TableToColumnsMap<TDbType, TablesToObject<TTables>> : TablesToColumnsMapFormatGroupedColumns<TTables, TGroupedColumns>,
            ops: DbFunctions<TDbType>
        ) => TResultShape<TDbType>,
        TCbResult extends TResultShape<TDbType> = TCb extends (cols: any, ops: any) => infer TR ? TR : never
    >(
        cb: TCb
    ): IExecuteableQuery<TDbType, TCbResult, AccumulateColumnParams<TParams, TCbResult>> {
        return new QueryBuilder(this.tables) as IExecuteableQuery<TDbType, TCbResult, AccumulateColumnParams<TParams, TCbResult>>;
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
        cb: (cols: TableToColumnsMap<TDbType, TablesToObject<[...TTables, TInnerJoinResult]>>, ops: DbOperators<TDbType>) => TCbResult
    ):
        IJoinClause<TDbType, [...TTables, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>> &
        ISelectClause<TDbType, [...TTables, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>> &
        IWhereClause<TDbType, [...TTables, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>> &
        IGroupByClause<TDbType, [...TTables, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>> {
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
            IGroupByClause<TDbType, [...TTables, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>>
    }

    where<
        TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>
    >(cb: (
        cols: TableToColumnsMap<TDbType, TablesToObject<TTables>>,
        ops: DbOperators<TDbType>
    ) => TCbResult):
        ISelectClause<TDbType, TTables, AccumulateComparisonParams<TParams, TCbResult>> {
        return new QueryBuilder(this.tables) as ISelectClause<TDbType, TTables, AccumulateComparisonParams<TParams, TCbResult>>;
    }

    groupBy<const TCbResult extends (ColumnsSelection<TDbType, any> | QueryColumn<TDbType, any, any, any>)[]
    >(cb: (cols: TableToColumnsMap<TDbType, TablesToObject<TTables>>) => TCbResult) {
        return this as ISelectClause<TDbType, TTables, TParams, TCbResult>
    }

    exec(params?: QueryParamsToObject<TParams>):
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