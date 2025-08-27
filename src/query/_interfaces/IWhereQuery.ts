import { DbType, PgDbType } from "../../db.js";
import { type PgValueTypes } from "../../postgresql/dataTypes.js";
import type { QueryParam } from "../queryColumn.js";
import type { QueryTablesObjectType } from "../../table/types/utils.js";
import type ColumnComparisonOperation from "../comparison.js";
import type ColumnLogicalOperation from "../logicalOperations.js";
import type { TableToColumnsMap } from "../_types/miscellaneous.js";
import type { AccumulateParams } from "../_types/result.js";
import { ISelectQuery } from "./ISelectQuery.js";

interface IWhereQuery<
    TDbType extends DbType,
    TTables extends QueryTablesObjectType<TDbType>,
    TParams extends QueryParam<TDbType, string, TDbType extends PgDbType ? PgValueTypes : never>[] | undefined = undefined
> {
    where<TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>
    >(cb: (cols: TableToColumnsMap<TTables>) => TCbResult):
        ISelectQuery<TDbType, TTables, AccumulateParams<TParams, TCbResult>>

}

export type {
    IWhereQuery
}