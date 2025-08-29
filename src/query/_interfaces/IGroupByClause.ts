import { DbType, PgDbType } from "../../db.js";
import { type PgValueTypes } from "../../postgresql/dataTypes.js";
import type { QueryParam } from "../queryColumn.js";
import type { TablesToObject, TableToColumnsMap } from "../_types/miscellaneous.js";
import type QueryTable from "../queryTable.js";
import type ISelectClause from "./ISelectClause.js";
import type QueryColumn from "../queryColumn.js";

interface IGroupByClause<
    TDbType extends DbType,
    TTables extends QueryTable<TDbType, any, any, any, any, any>[],
    TParams extends QueryParam<TDbType, string, TDbType extends PgDbType ? PgValueTypes : never>[] | undefined = undefined
> {
    groupBy<
        const TCbResult extends ({ [key: string]: QueryColumn<TDbType, any, any, any> } | QueryColumn<TDbType, any, any, any>)[]
    >(cb: (cols: TableToColumnsMap<TablesToObject<TTables>>) => TCbResult):
        ISelectClause<TDbType, TTables, TParams, TCbResult>

}

export default IGroupByClause;