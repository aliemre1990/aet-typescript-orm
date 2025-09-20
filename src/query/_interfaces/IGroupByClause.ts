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

type GroupBySpecs<TDbType extends DbType> = readonly (ColumnsSelection<TDbType, any, any> | QueryColumn<TDbType, any, any, any>)[];

interface IGroupByClause<
    TDbType extends DbType,
    TTables extends readonly QueryTable<TDbType, any, any, any, any, any>[],
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null>[] | undefined = undefined
> {
    groupBy<
        const TCbResult extends GroupBySpecs<TDbType>
    >(cb: (cols: TableToColumnsMap<TDbType, TablesToObject<TTables>>) => TCbResult):
        ISelectClause<TDbType, TTables, TParams, TCbResult> &
        IHavingClause<TDbType, TTables, TParams, TCbResult> &
        IOrderByClause<TDbType, TTables, TParams, TCbResult>
}

export default IGroupByClause;

export type {
    GroupBySpecs
}