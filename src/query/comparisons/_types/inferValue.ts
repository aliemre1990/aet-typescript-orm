import type { DbType } from "../../../db.js";
import type Column from "../../../table/column.js";
import type ColumnSQLFunction from "../../functions/_functions.js";
import type QueryColumn from "../../queryColumn.js";
import type { IComparable } from "../_interfaces/IComparable.js";

type InferValueTypeFromThisType<TDbType extends DbType, T> =
    T extends QueryColumn<TDbType, infer TCol, any, any> ? TCol extends Column<TDbType, any, any, any, any, infer TValType, any> ? TValType : never :
    T extends ColumnSQLFunction<TDbType, any, any, infer TRet, any, any> ? NonNullable<TRet> :
    never;

type InferValueTypeFromComparable<TDbType extends DbType, T> =
    T extends IComparable<TDbType, any, infer TValueType, any, any, any> ? TValueType : never;

export type {
    InferValueTypeFromThisType,
    InferValueTypeFromComparable
}