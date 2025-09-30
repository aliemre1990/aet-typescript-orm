import { DbType } from "../../db.js";
import type ColumnComparisonOperation from "../comparisons/_comparisonOperations.js";
import type ColumnLogicalOperation from "../logicalOperations.js";
import type { TablesToObject, TableToColumnsMap } from "../_types/miscellaneous.js";
import type QueryTable from "../queryTable.js";
import type ISelectClause from "./ISelectClause.js";
import type { DbOperators } from "../_types/ops.js";
import type QueryParam from "../param.js";
import type IGroupByClause from "./IGroupByClause.js";
import type IOrderByClause from "./IOrderByClause.js";
import type { DbValueTypes } from "../../table/column.js";
import type QueryBuilder from "../queryBuilder.js";
import type { IExecuteableQuery } from "./IExecuteableQuery.js";
import type { AccumulateComparisonParams } from "../_types/paramAccumulationComparison.js";

interface IWhereClause<
    TDbType extends DbType,
    TQueryItems extends readonly (QueryTable<TDbType, any, any, any, any, any> | IExecuteableQuery<TDbType, any, any, any, any, any, any>)[],
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null, any, any, any>[] | undefined = undefined
> {
    where<TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>
    >(cb: (
        cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, TQueryItems>>,
        ops: DbOperators<TDbType, false>
    ) => TCbResult):
        ISelectClause<TDbType, TQueryItems, AccumulateComparisonParams<TParams, TCbResult>> &
        IGroupByClause<TDbType, TQueryItems, AccumulateComparisonParams<TParams, TCbResult>> &
        IOrderByClause<TDbType, TQueryItems, AccumulateComparisonParams<TParams, TCbResult>>

}

export default IWhereClause;