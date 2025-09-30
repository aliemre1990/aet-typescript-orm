import { DbType } from "../../db.js";
import type { TablesToObject, TableToColumnsMap } from "../_types/miscellaneous.js";
import type { TResultShape } from "../_types/result.js";
import { IExecuteableQuery } from "./IExecuteableQuery.js";
import type QueryTable from "../queryTable.js";
import type { GroupedTablesToColumnsMap } from "../_types/grouping.js";
import type { DbFunctions } from "../_types/ops.js";
import type QueryParam from "../param.js";
import type { OrderBySpecs } from "./IOrderByClause.js";
import type { GroupBySpecs } from "./IGroupByClause.js";
import type { DbValueTypes } from "../../table/column.js";
import type QueryBuilder from "../queryBuilder.js";
import type { AccumulateColumnParams } from "../_types/paramAccumulationSelect.js";

interface ISelectClause<
    TDbType extends DbType,
    TQueryItems extends readonly (QueryTable<TDbType, any, any, any, any, any> | IExecuteableQuery<TDbType, any, any, any, any, any, any>)[],
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null, any, any, any>[] | undefined = undefined,
    TGroupedColumns extends GroupBySpecs<TDbType> | undefined = undefined,
    TOrderBySpecs extends OrderBySpecs<TDbType> | undefined = undefined
> {
    select<
        const TCbResult extends TResultShape<TDbType>
    >(
        cb: (
            cols: TGroupedColumns extends undefined ? TableToColumnsMap<TDbType, TablesToObject<TDbType, TQueryItems>> : GroupedTablesToColumnsMap<TDbType, TQueryItems, TGroupedColumns>,
            ops: DbFunctions<TDbType, TGroupedColumns extends undefined ? false : true>
        ) => TCbResult
    ): IExecuteableQuery<TDbType, TQueryItems, TCbResult, AccumulateColumnParams<TParams, TCbResult>, TGroupedColumns, TOrderBySpecs>

}

export default ISelectClause;