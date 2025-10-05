import { DbType } from "../../db.js";
import type ColumnComparisonOperation from "../comparisons/_comparisonOperations.js";
import type ColumnLogicalOperation from "../logicalOperations.js";
import type { TablesToObject, TableToColumnsMap } from "../_types/miscellaneous.js";
import type ISelectClause from "./ISelectClause.js";
import type { DbOperators } from "../_types/ops.js";
import type QueryParam from "../param.js";
import type IGroupByClause from "./IGroupByClause.js";
import type IOrderByClause from "./IOrderByClause.js";
import type { DbValueTypes } from "../../table/column.js";
import type { AccumulateComparisonParams } from "../_types/paramAccumulationComparison.js";
import type { ComparisonType, FromType, JoinSpecsType } from "../queryBuilder.js";

interface IWhereClause<
    TDbType extends DbType,
    TFrom extends FromType<TDbType>,
    TJoinSpecs extends JoinSpecsType<TDbType> | undefined,
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null, any, any, any>[] | undefined = undefined
> {
    where<TCbResult extends ComparisonType<TDbType>>(
        cb: (
            cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>,
            ops: DbOperators<TDbType, false>
        ) => TCbResult):
        ISelectClause<TDbType, TFrom, TJoinSpecs, AccumulateComparisonParams<TParams, TCbResult>> &
        IGroupByClause<TDbType, TFrom, TJoinSpecs, AccumulateComparisonParams<TParams, TCbResult>> &
        IOrderByClause<TDbType, TFrom, TJoinSpecs, AccumulateComparisonParams<TParams, TCbResult>>

}

export default IWhereClause;