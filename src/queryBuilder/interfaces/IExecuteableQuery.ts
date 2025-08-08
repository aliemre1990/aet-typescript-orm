import type { DbType } from "../../db.js"
import type { ColumnTableSpecs, ColumnType } from "../../table.js"
import type { ColumnsToResultMap } from "../../types.js"

interface IExecuteableQuery<
    TDbType extends DbType,
    TResult extends { [key: string]: ColumnType<TDbType, ColumnTableSpecs, string | undefined> | Record<PropertyKey, ColumnType<TDbType, ColumnTableSpecs, string | undefined>> } | undefined = undefined
> {
    exec: () => ColumnsToResultMap<TDbType, TResult>
}

export type {
    IExecuteableQuery
}