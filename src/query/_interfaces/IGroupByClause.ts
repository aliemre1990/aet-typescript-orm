import { DbType } from "../../db.js";
import type { TablesToObject, TableToColumnsMap } from "../_types/miscellaneous.js";
import type QueryTable from "../queryTable.js";
import type ISelectClause from "./ISelectClause.js";
import type QueryColumn from "../queryColumn.js";
import type QueryParam from "../param.js";
import type { ColumnsSelection } from "../queryColumn.js";
import type IWhereClause from "./IWhereClause.js";
import type IHavingClause from "./IHavingClause.js";
import type IOrderByClause from "./IOrderByClause.js";
import type { DbValueTypes } from "../../table/column.js";
import type { IComparable } from "./IComparable.js";
import type QueryBuilder from "../queryBuilder.js";
import type { IExecuteableQuery } from "./IExecuteableQuery.js";

type GroupBySpecs<TDbType extends DbType> = readonly (ColumnsSelection<TDbType, any, any> | IComparable<TDbType, any, any, any, false>)[];

interface IGroupByClause<
    TDbType extends DbType,
    TQueryItems extends readonly (QueryTable<TDbType, any, any, any, any, any> | IExecuteableQuery<TDbType, any, any, any, any, any, any>)[],
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null>[] | undefined = undefined
> {
    groupBy<
        const TCbResult extends GroupBySpecs<TDbType>
    >(cb: (cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, TQueryItems>>) => TCbResult):
        ISelectClause<TDbType, TQueryItems, TParams, TCbResult> &
        IHavingClause<TDbType, TQueryItems, TParams, TCbResult> &
        IOrderByClause<TDbType, TQueryItems, TParams, TCbResult>
}

export default IGroupByClause;

export type {
    GroupBySpecs
}