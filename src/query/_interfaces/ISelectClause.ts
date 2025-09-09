import { DbType, type PgDbType } from "../../db.js";
import type { PgValueTypes } from "../../postgresql/dataTypes.js";
import type { QueryParam } from "../queryColumn.js";
import type { TablesToObject, TableToColumnsMap } from "../_types/miscellaneous.js";
import type {  TResultShape } from "../_types/result.js";
import { IExecuteableQuery } from "./IExecuteableQuery.js";
import type QueryTable from "../queryTable.js";
import type QueryColumn from "../queryColumn.js";
import type { TablesToColumnsMapFormatGroupedColumns } from "../_types/grouping.js";

interface ISelectClause<
    TDbType extends DbType,
    TTables extends QueryTable<TDbType, any, any, any, any, any>[],
    TParams extends QueryParam<TDbType, string, TDbType extends PgDbType ? PgValueTypes : never>[] | undefined = undefined,
    TGroupedColumns extends ({ [key: string]: QueryColumn<TDbType, any, any, any> } | QueryColumn<TDbType, any, any, any>)[] | undefined = undefined
> {
    select<TCb extends undefined>():
        IExecuteableQuery<TDbType, TTables, TCb extends (cols: any) => infer TR ? TR : undefined, TParams, TGroupedColumns>
    select<TCb extends (
        cols: TGroupedColumns extends undefined ?
            TableToColumnsMap<TablesToObject<TTables>> :
            TablesToColumnsMapFormatGroupedColumns<TTables, TGroupedColumns>
    ) =>  TResultShape<TDbType>
    >(cb: TCb | undefined):
        IExecuteableQuery<TDbType, TTables, TCb extends (cols: any) => infer TR ? TR : undefined, TParams, TGroupedColumns>
    select<
        TCb extends (
            cols: TGroupedColumns extends undefined ?
                TableToColumnsMap<TablesToObject<TTables>> :
                TablesToColumnsMapFormatGroupedColumns<TTables, TGroupedColumns>
        ) =>  TResultShape<TDbType>
    >(
        cb?: TCb
    ): IExecuteableQuery<TDbType, TTables, TCb extends (cols: any) => infer TR ? TR : undefined, TParams, TGroupedColumns>

}

export default ISelectClause;