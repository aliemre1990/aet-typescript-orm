import { DbType } from "../../db.js";
import type { TablesToObject, TableToColumnsMap } from "../_types/miscellaneous.js";
import type { ResultShape } from "../_types/result.js";
import { IExecuteableQuery } from "./IExecuteableQuery.js";
import type QueryTable from "../queryTable.js";
import type { DbFunctions } from "../_types/ops.js";
import type QueryParam from "../param.js";
import type { OrderBySpecs } from "./IOrderByClause.js";
import type { GroupBySpecs } from "./IGroupByClause.js";
import type { DbValueTypes } from "../../table/column.js";
import type QueryBuilder from "../queryBuilder.js";
import type { AccumulateColumnParams } from "../_types/paramAccumulationSelect.js";
import type { FromType, JoinSpecsType } from "../queryBuilder.js";

interface ISelectClause<
    TDbType extends DbType,
    TFrom extends FromType<TDbType>,
    TJoinSpecs extends JoinSpecsType<TDbType> | undefined,
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null, any, any>[] | undefined = undefined
> {
    select<
        const TCbResult extends ResultShape<TDbType>
    >(
        cb: (
            cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>,
            ops: DbFunctions<TDbType, true>
        ) => TCbResult
    ): IExecuteableQuery<TDbType, TFrom, TJoinSpecs, TCbResult, AccumulateColumnParams<TParams, TCbResult>>

}

export default ISelectClause;