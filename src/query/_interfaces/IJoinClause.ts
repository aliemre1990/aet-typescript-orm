import { DbType } from "../../db.js";
import type QueryColumn from "../queryColumn.js";
import type Table from "../../table/table.js";
import type ColumnComparisonOperation from "../comparisons/_comparisonOperations.js";
import type ColumnLogicalOperation from "../logicalOperations.js";
import type { TablesToObject, TableToColumnsMap } from "../_types/miscellaneous.js";
import type QueryTable from "../queryTable.js";
import type ISelectClause from "./ISelectClause.js";
import type IGroupByClause from "./IGroupByClause.js";
import type { DbOperators } from "../_types/ops.js";
import type IWhereClause from "./IWhereClause.js";
import type QueryParam from "../param.js";
import type IOrderByClause from "./IOrderByClause.js";
import type { DbValueTypes } from "../../table/column.js";
import type { IExecuteableQuery } from "./IExecuteableQuery.js";
import type { AccumulateSubQueryParams, ConvertComparableIdsOfSelectResult } from "../_types/subQueryUtility.js";
import type { AccumulateComparisonParams } from "../_types/paramAccumulationComparison.js";
import type { FromType, JoinSpecsType } from "../queryBuilder.js";
import type { MapToQueryColumns } from "../../table/table.js";

const joinTypes = {
    inner: 'INNER',
    left: 'LEFT',
    right: 'RIGHT',
    full: 'FULL'
} as const;

type JoinType = typeof joinTypes[keyof typeof joinTypes];


interface IJoinClause<
    TDbType extends DbType,
    TFrom extends FromType<TDbType>,
    TJoinSpecs extends JoinSpecsType<TDbType> | undefined,
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null, any, any, any>[] | undefined = undefined
> {

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
        IOrderByClause<TDbType, TFrom, TInnerJoinAccumulated, TAccumulatedParamsResult>

}

export default IJoinClause;

export {
    joinTypes
}

export type {
    JoinType
}