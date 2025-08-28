import { DbType, type PgDbType } from "../../db.js";
import type { PgValueTypes } from "../../postgresql/dataTypes.js";
import type { QueryParam } from "../queryColumn.js";
import type { TablesToObject, TableToColumnsMap } from "../_types/miscellaneous.js";
import type { TResultShape } from "../_types/result.js";
import { IExecuteableQuery } from "./IExecuteableQuery.js";
import type QueryTable from "../queryTable.js";

interface ISelectClause<
    TDbType extends DbType,
    TTables extends QueryTable<TDbType, any, any, any, any, any>[],
    TParams extends QueryParam<TDbType, string, TDbType extends PgDbType ? PgValueTypes : never>[] | undefined = undefined
> {
    select<TCb extends undefined>():
        IExecuteableQuery<TDbType, TTables, TCb extends (cols: any) => infer TR ? TR : undefined, TParams>
    select<
        TCb extends ((cols: TableToColumnsMap<TablesToObject<TTables>>) => TResultShape<TDbType>)
    >(cb: TCb):
        IExecuteableQuery<TDbType, TTables, TCb extends (cols: any) => infer TR ? TR : undefined, TParams>
    select<
        TCb extends ((cols: TableToColumnsMap<TablesToObject<TTables>>) => TResultShape<TDbType>)
    >(
        cb?: TCb): IExecuteableQuery<TDbType, TTables, TCb extends (cols: any) => infer TR ? TR : undefined, TParams>
}

export default ISelectClause;