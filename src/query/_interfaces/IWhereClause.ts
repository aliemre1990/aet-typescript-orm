import { DbType } from "../../db.js";
import type ColumnComparisonOperation from "../comparisons/_comparisonOperations.js";
import type ColumnLogicalOperation from "../logicalOperations.js";
import type { TablesToObject, TableToColumnsMap } from "../_types/miscellaneous.js";
import type { AccumulateComparisonParams } from "../_types/result.js";
import type QueryTable from "../queryTable.js";
import type ISelectClause from "./ISelectClause.js";
import type { DbOperators } from "../_types/ops.js";
import type QueryParam from "../param.js";
import type IGroupByClause from "./IGroupByClause.js";
import type IOrderByClause from "./IOrderByClause.js";
import type { DbValueTypes } from "../../table/column.js";

interface IWhereClause<
    TDbType extends DbType,
    TTables extends readonly QueryTable<TDbType, any, any, any, any, any>[],
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null>[] | undefined = undefined
> {
    where<TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>
    >(cb: (
        cols: TableToColumnsMap<TDbType, TablesToObject<TTables>>,
        ops: DbOperators<TDbType, false>
    ) => TCbResult):
        ISelectClause<TDbType, TTables, AccumulateComparisonParams<TParams, TCbResult>> &
        IGroupByClause<TDbType, TTables, AccumulateComparisonParams<TParams, TCbResult>> &
        IOrderByClause<TDbType, TTables, AccumulateComparisonParams<TParams, TCbResult>>

}

export default IWhereClause;