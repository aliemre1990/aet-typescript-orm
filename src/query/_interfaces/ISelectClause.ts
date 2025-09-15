import { DbType, type DbValueTypes } from "../../db.js";
import type { TablesToObject, TableToColumnsMap } from "../_types/miscellaneous.js";
import type { AccumulateColumnParams, TResultShape } from "../_types/result.js";
import { IExecuteableQuery } from "./IExecuteableQuery.js";
import type QueryTable from "../queryTable.js";
import type QueryColumn from "../queryColumn.js";
import type { TablesToColumnsMapFormatGroupedColumns } from "../_types/grouping.js";
import type { DbFunctions } from "../_types/ops.js";
import type QueryParam from "../param.js";
import type { ColumnsSelection } from "../queryColumn.js";

interface ISelectClause<
    TDbType extends DbType,
    TTables extends readonly QueryTable<TDbType, any, any, any, any, any>[],
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null>[] | undefined = undefined,
    TGroupedColumns extends (ColumnsSelection<TDbType,any> | QueryColumn<TDbType, any, any, any>)[] | undefined = undefined
> {
    select<
        TCb extends (
            cols: TGroupedColumns extends undefined ? TableToColumnsMap<TDbType,TablesToObject<TTables>> : TablesToColumnsMapFormatGroupedColumns<TTables, TGroupedColumns>,
            ops: DbFunctions<TDbType>
        ) => TResultShape<TDbType>,
        TCbResult extends TResultShape<TDbType> = TCb extends (cols: any, ops: any) => infer TR ? TR : never
    >(
        cb: TCb
    ): IExecuteableQuery<TDbType, TCbResult, AccumulateColumnParams<TParams, TCbResult>>

}

export default ISelectClause;