import { DbType, type DbValueTypes } from "../../db.js";
import type { TablesToObject, TableToColumnsMap } from "../_types/miscellaneous.js";
import type QueryTable from "../queryTable.js";
import type ISelectClause from "./ISelectClause.js";
import type QueryColumn from "../queryColumn.js";
import type QueryParam from "../param.js";
import type { ColumnsSelection } from "../queryColumn.js";
import type IWhereClause from "./IWhereClause.js";

interface IGroupByClause<
    TDbType extends DbType,
    TTables extends readonly QueryTable<TDbType, any, any, any, any, any>[],
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null>[] | undefined = undefined
> {
    groupBy<
        const TCbResult extends (ColumnsSelection<TDbType, any, any> | QueryColumn<TDbType, any, any, any>)[]
    >(cb: (cols: TableToColumnsMap<TDbType, TablesToObject<TTables>>) => TCbResult):
        ISelectClause<TDbType, TTables, TParams, TCbResult> &
        IWhereClause<TDbType, TTables, TParams, TCbResult>

}

export default IGroupByClause;