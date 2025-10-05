import { DbType } from "../../db.js";
import type { TablesToObject, TableToColumnsMap } from "../_types/miscellaneous.js";
import type ISelectClause from "./ISelectClause.js";
import type QueryParam from "../param.js";
import type { IComparable } from "./IComparable.js";
import type { GroupBySpecs } from "./IGroupByClause.js";
import type { DbValueTypes } from "../../table/column.js";
import type { AccumulateOrderByParams } from "../_types/paramAccumulationOrderBy.js";
import type { FromType, JoinSpecsType } from "../queryBuilder.js";

const orderTypes = {
    asc: 'ASC',
    desc: 'DESC'
} as const;

type OrderType = typeof orderTypes[keyof typeof orderTypes];

type OrderBySpecs<TDbType extends DbType> = readonly (IComparable<TDbType, any, any, any, any, false, any, any> | [IComparable<TDbType, any, any, any, any, false, any, any>, OrderType])[];

interface IOrderByClause<
    TDbType extends DbType,
    TFrom extends FromType<TDbType>,
    TJoinSpecs extends JoinSpecsType<TDbType> | undefined,
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null, any, any, any>[] | undefined = undefined,
    TGroupedColumns extends GroupBySpecs<TDbType> | undefined = undefined,
> {

    orderBy<
        const  TCbResult extends OrderBySpecs<TDbType>
    >(cb: (cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>) => TCbResult):
        ISelectClause<TDbType, TFrom, TJoinSpecs, AccumulateOrderByParams<TDbType, TParams, TCbResult>, TGroupedColumns>

}

export default IOrderByClause;

export { orderTypes }

export type {
    OrderType,
    OrderBySpecs
}