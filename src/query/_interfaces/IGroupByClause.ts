import { DbType } from "../../db.js";
import type { TablesToObject, TableToColumnsMap } from "../_types/miscellaneous.js";
import type ISelectClause from "./ISelectClause.js";
import type QueryParam from "../param.js";
import type IHavingClause from "./IHavingClause.js";
import type IOrderByClause from "./IOrderByClause.js";
import type { DbValueTypes } from "../../table/column.js";
import type { IComparable } from "./IComparable.js";
import type { DbFunctions } from "../_types/ops.js";
import type ColumnsSelection from "../columnsSelection.js";
import type { FromType, JoinSpecsType } from "../queryBuilder.js";

type GroupBySpecs<TDbType extends DbType> = readonly (ColumnsSelection<TDbType, any, any> | IComparable<TDbType, any, any, any, any, false, any, any>)[];

interface IGroupByClause<
    TDbType extends DbType,
    TFrom extends FromType<TDbType>,
    TJoinSpecs extends JoinSpecsType<TDbType> | undefined,
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null, any, any, any>[] | undefined = undefined
> {
    groupBy<
        const TCbResult extends GroupBySpecs<TDbType>
    >(cb: (
        cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>,
        ops: DbFunctions<TDbType, false>
    ) => TCbResult):
        ISelectClause<TDbType, TFrom, TJoinSpecs, TParams, TCbResult> &
        IHavingClause<TDbType, TFrom, TJoinSpecs, TParams, TCbResult> &
        IOrderByClause<TDbType, TFrom, TJoinSpecs, TParams, TCbResult>
}

export default IGroupByClause;

export type {
    GroupBySpecs
}