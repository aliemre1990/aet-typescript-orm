import { DbType, type DbValueTypes } from "../../db.js";
import type ColumnComparisonOperation from "../comparisons/_comparisonOperations.js";
import type ColumnLogicalOperation from "../logicalOperations.js";
import type { TablesToObject, TableToColumnsMap } from "../_types/miscellaneous.js";
import type { AccumulateComparisonParams } from "../_types/result.js";
import type QueryTable from "../queryTable.js";
import type ISelectClause from "./ISelectClause.js";
import type { DbOperators } from "../_types/ops.js";
import type QueryParam from "../param.js";
import type { ColumnsSelection } from "../queryColumn.js";
import type QueryColumn from "../queryColumn.js";

interface IWhereClause<
    TDbType extends DbType,
    TTables extends readonly QueryTable<TDbType, any, any, any, any, any>[],
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null>[] | undefined = undefined,
    TGroupedColumns extends (ColumnsSelection<TDbType, any> | QueryColumn<TDbType, any, any, any>)[] | undefined = undefined,
> {
    where<TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>
    >(cb: (
        cols: TableToColumnsMap<TDbType, TablesToObject<TTables>>,
        ops: DbOperators<TDbType, TGroupedColumns extends undefined ? false : true>
    ) => TCbResult):
        ISelectClause<TDbType, TTables, AccumulateComparisonParams<TParams, TCbResult>, TGroupedColumns>

}

export default IWhereClause;