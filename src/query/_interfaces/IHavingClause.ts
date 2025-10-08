import { DbType } from "../../db.js";
import type { DbOperators } from "../_types/ops.js";
import type QueryParam from "../param.js";
import type ISelectClause from "./ISelectClause.js";
import type IOrderByClause from "./IOrderByClause.js";
import type { GroupBySpecs } from "./IGroupByClause.js";
import type { DbValueTypes } from "../../table/column.js";
import type { AccumulateComparisonParams } from "../_types/paramAccumulationComparison.js";
import type { ComparisonType, FromType, JoinSpecsType } from "../queryBuilder.js";
import type { TablesToObject, TableToColumnsMap } from "../_types/miscellaneous.js";

interface IHavingClause<
    TDbType extends DbType,
    TFrom extends FromType<TDbType>,
    TJoinSpecs extends JoinSpecsType<TDbType> | undefined,
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null, any, any>[] | undefined = undefined
> {
    having<TCbResult extends ComparisonType<TDbType>>(cb: (
        cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>,
        ops: DbOperators<TDbType, true>
    ) => TCbResult):
        ISelectClause<TDbType, TFrom, TJoinSpecs, AccumulateComparisonParams<TParams, TCbResult>> &
        IOrderByClause<TDbType, TFrom, TJoinSpecs, AccumulateComparisonParams<TParams, TCbResult>>

}

export default IHavingClause;