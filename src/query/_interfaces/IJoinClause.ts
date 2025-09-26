import { DbType } from "../../db.js";
import type QueryColumn from "../queryColumn.js";
import type Table from "../../table/table.js";
import type ColumnComparisonOperation from "../comparisons/_comparisonOperations.js";
import type ColumnLogicalOperation from "../logicalOperations.js";
import type { TablesToObject, TableToColumnsMap } from "../_types/miscellaneous.js";
import type { AccumulateComparisonParams } from "../_types/result.js";
import type QueryTable from "../queryTable.js";
import type ISelectClause from "./ISelectClause.js";
import type IGroupByClause from "./IGroupByClause.js";
import type { DbOperators } from "../_types/ops.js";
import type IWhereClause from "./IWhereClause.js";
import type QueryParam from "../param.js";
import type IOrderByClause from "./IOrderByClause.js";
import type { DbValueTypes } from "../../table/column.js";
import type QueryBuilder from "../queryBuilder.js";
import type { IExecuteableQuery } from "./IExecuteableQuery.js";
import type { AccumulateSubQueryParams } from "../_types/subQueryUtility.js";

const joinTypes = {
    inner: 'INNER',
    left: 'LEFT',
    right: 'RIGHT',
    full: 'FULL'
} as const;

type JoinType = typeof joinTypes[keyof typeof joinTypes];


interface IJoinClause<
    TDbType extends DbType,
    TQueryItems extends readonly (QueryTable<TDbType, any, any, any, any, any> | IExecuteableQuery<TDbType, any, any, any, any, any, any>)[],
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null, any, any>[] | undefined = undefined
> {

    join<
        TInnerJoinTable extends Table<TDbType, any, any> | QueryTable<TDbType, any, any, any, any, any> | IExecuteableQuery<TDbType, any, any, any, any, any, string>,
        TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>,
        TInnerJoinResult extends QueryTable<TDbType, any, any, any, any, any> | IExecuteableQuery<TDbType, any, any, any, any, any, any> = TInnerJoinTable extends Table<TDbType, infer TInnerCols, infer TInnerTableName> ?
        QueryTable<
            TDbType,
            TInnerCols,
            TInnerTableName,
            Table<TDbType, TInnerCols, TInnerTableName>,
            { [K in keyof TInnerCols]: QueryColumn<TDbType, TInnerCols[K], { tableName: TInnerTableName, asTableName: undefined }> }
        > :
        TInnerJoinTable,
        TAccumulatedParams extends QueryParam<TDbType, any, any, any, any>[] = AccumulateSubQueryParams<TDbType, [TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>>,
        TAccumulatedParamsResult extends QueryParam<TDbType, any, any, any, any>[] | undefined = TAccumulatedParams["length"] extends 0 ? undefined : TAccumulatedParams
    >(
        type: JoinType,
        table: TInnerJoinTable,
        cb: (cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, [...TQueryItems, TInnerJoinResult]>>, ops: DbOperators<TDbType, false>) => TCbResult
    ):
        IJoinClause<TDbType, [...TQueryItems, TInnerJoinResult], TAccumulatedParamsResult> &
        ISelectClause<TDbType, [...TQueryItems, TInnerJoinResult], TAccumulatedParamsResult> &
        IWhereClause<TDbType, [...TQueryItems, TInnerJoinResult], TAccumulatedParamsResult> &
        IGroupByClause<TDbType, [...TQueryItems, TInnerJoinResult], TAccumulatedParamsResult> &
        IOrderByClause<TDbType, [...TQueryItems, TInnerJoinResult], TAccumulatedParamsResult>

}

export default IJoinClause;

export {
    joinTypes
}

export type {
    JoinType
}