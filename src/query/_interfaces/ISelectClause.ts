import { DbType } from "../../db.js";
import type { TablesToObject, TableToColumnsMap } from "../_types/miscellaneous.js";
import type { AccumulateColumnParams, TResultShape } from "../_types/result.js";
import { IExecuteableQuery } from "./IExecuteableQuery.js";
import type QueryTable from "../queryTable.js";
import type QueryColumn from "../queryColumn.js";
import type { GroupedTablesToColumnsMap } from "../_types/grouping.js";
import type { DbFunctions } from "../_types/ops.js";
import type QueryParam from "../param.js";
import type { ColumnsSelection } from "../queryColumn.js";
import type { OrderBySpecs } from "./IOrderByClause.js";
import type { GroupBySpecs } from "./IGroupByClause.js";
import type { DbValueTypes } from "../../table/column.js";

interface ISelectClause<
    TDbType extends DbType,
    TTables extends readonly QueryTable<TDbType, any, any, any, any, any>[],
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null>[] | undefined = undefined,
    TGroupedColumns extends GroupBySpecs<TDbType> | undefined = undefined,
    TOrderBySpecs extends OrderBySpecs<TDbType> | undefined = undefined
> {
    select<
        TCb extends (
            cols: TGroupedColumns extends undefined ? TableToColumnsMap<TDbType, TablesToObject<TTables>> : GroupedTablesToColumnsMap<TDbType, TTables, TGroupedColumns>,
            ops: DbFunctions<TDbType, TGroupedColumns extends undefined ? false : true>
        ) => TResultShape<TDbType>,
        TCbResult extends TResultShape<TDbType> = TCb extends (cols: any, ops: any) => infer TR ? TR : never
    >(
        cb: TCb
    ): IExecuteableQuery<TDbType, TTables, TCbResult[], AccumulateColumnParams<TParams, TCbResult>, TGroupedColumns, TOrderBySpecs>

}

export default ISelectClause;