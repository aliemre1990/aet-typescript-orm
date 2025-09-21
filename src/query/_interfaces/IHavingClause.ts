import { DbType } from "../../db.js";
import type { AccumulateComparisonParams } from "../_types/result.js";
import type QueryTable from "../queryTable.js";
import type { DbOperators } from "../_types/ops.js";
import type QueryParam from "../param.js";
import type ISelectClause from "./ISelectClause.js";
import type ColumnComparisonOperation from "../comparisons/_comparisonOperations.js";
import type ColumnLogicalOperation from "../logicalOperations.js";
import type { GroupedTablesToColumnsMap } from "../_types/grouping.js";
import type IOrderByClause from "./IOrderByClause.js";
import type { GroupBySpecs } from "./IGroupByClause.js";
import type { DbValueTypes } from "../../table/column.js";
import type QueryBuilder from "../queryBuilder.js";
import type { IExecuteableQuery } from "./IExecuteableQuery.js";

interface IHavingClause<
    TDbType extends DbType,
    TQueryItems extends readonly (QueryTable<TDbType, any, any, any, any, any> | IExecuteableQuery<TDbType, any, any, any, any, any, any>)[],
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null>[] | undefined = undefined,
    TGroupedColumns extends GroupBySpecs<TDbType> | undefined = undefined
> {
    having<TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>
    >(cb: (
        cols: GroupedTablesToColumnsMap<TDbType, TQueryItems, TGroupedColumns>,
        ops: DbOperators<TDbType, true>
    ) => TCbResult):
        ISelectClause<TDbType, TQueryItems, AccumulateComparisonParams<TParams, TCbResult>, TGroupedColumns> &
        IOrderByClause<TDbType, TQueryItems, AccumulateComparisonParams<TParams, TCbResult>, TGroupedColumns>

}

export default IHavingClause;