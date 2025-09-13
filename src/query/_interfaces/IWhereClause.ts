import { DbType, PgDbType, type DbValueTypes } from "../../db.js";
import { type PgValueTypes } from "../../postgresql/dataTypes.js";
import type { QueryParam } from "../queryColumn.js";
import type ColumnComparisonOperation from "../comparisons/_comparisonOperations.js";
import type ColumnLogicalOperation from "../logicalOperations.js";
import type { TablesToObject, TableToColumnsMap } from "../_types/miscellaneous.js";
import type { AccumulateParams } from "../_types/result.js";
import type QueryTable from "../queryTable.js";
import type ISelectClause from "./ISelectClause.js";
import type { DbOperators } from "../_types/ops.js";

interface IWhereClause<
    TDbType extends DbType,
    TTables extends readonly QueryTable<TDbType, any, any, any, any, any>[],
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null>[] | undefined = undefined
> {
    where<TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>
    >(cb: (
        cols: TableToColumnsMap<TablesToObject<TTables>>,
        ops: DbOperators<TDbType>
    ) => TCbResult):
        ISelectClause<TDbType, TTables, AccumulateParams<TParams, TCbResult>>

}

export default IWhereClause;