import { DbType } from "../../db.js";
import type { TablesToObject, TableToColumnsMap } from "../_types/miscellaneous.js";
import type { AccumulateOrderByParams } from "../_types/result.js";
import type QueryTable from "../queryTable.js";
import type ISelectClause from "./ISelectClause.js";
import type QueryParam from "../param.js";
import type { IComparable } from "../comparisons/_interfaces/IComparable.js";
import type { GroupBySpecs } from "./IGroupByClause.js";
import type { DbValueTypes } from "../../table/column.js";
import type { QueryBuilder } from "../queryBuilder.js";

const orderTypes = {
    asc: 'ASC',
    desc: 'DESC'
} as const;

type OrderType = typeof orderTypes[keyof typeof orderTypes];

type OrderBySpecs<TDbType extends DbType> = readonly (IComparable<TDbType, any, any, any, false> | [IComparable<TDbType, any, any, any, false>, OrderType])[];

interface IOrderByClause<
    TDbType extends DbType,
    TQueryItems extends readonly (QueryTable<TDbType, any, any, any, any, any> | QueryBuilder<TDbType, any, any, any, any, any, any>)[],
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null>[] | undefined = undefined,
    TGroupedColumns extends GroupBySpecs<TDbType> | undefined = undefined,
> {

    orderBy<
        const  TCbResult extends OrderBySpecs<TDbType>
    >(cb: (cols: TableToColumnsMap<TDbType, TablesToObject<TDbType,TQueryItems>>) => TCbResult):
        ISelectClause<TDbType, TQueryItems, AccumulateOrderByParams<TDbType, TParams, TCbResult>, TGroupedColumns, TCbResult>

}

export default IOrderByClause;

export { orderTypes }

export type {
    OrderType,
    OrderBySpecs
}