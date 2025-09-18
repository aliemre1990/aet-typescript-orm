import { DbType, type DbValueTypes } from "../../db.js";
import type { AccumulateComparisonParams } from "../_types/result.js";
import type QueryTable from "../queryTable.js";
import type QueryColumn from "../queryColumn.js";
import type { DbOperators } from "../_types/ops.js";
import type QueryParam from "../param.js";
import type { ColumnsSelection } from "../queryColumn.js";
import type ISelectClause from "./ISelectClause.js";
import type ColumnComparisonOperation from "../comparisons/_comparisonOperations.js";
import type ColumnLogicalOperation from "../logicalOperations.js";
import type { GroupedTablesToColumnsMap } from "../_types/grouping.js";

interface IHavingClause<
    TDbType extends DbType,
    TTables extends readonly QueryTable<TDbType, any, any, any, any, any>[],
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null>[] | undefined = undefined,
    TGroupedColumns extends (ColumnsSelection<TDbType, any, any> | QueryColumn<TDbType, any, any, any>)[] | undefined = undefined
> {
    having<TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>
    >(cb: (
        cols: GroupedTablesToColumnsMap<TDbType, TTables, TGroupedColumns>,
        ops: DbOperators<TDbType, true>
    ) => TCbResult): ISelectClause<TDbType, TTables, AccumulateComparisonParams<TParams, TCbResult>, TGroupedColumns>

}

export default IHavingClause;