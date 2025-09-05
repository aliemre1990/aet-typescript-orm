import type { DbType } from "../../../db.js";
import type Column from "../../../table/column.js";
import type { ClearNull } from "../../../utility/common.js";
import type ColumnSQLFunction from "../../functions/_functions.js";
import type QueryColumn from "../../queryColumn.js";

type InferValueTypeFromThisType<TDbType extends DbType, T> =
    T extends QueryColumn<TDbType, infer TCol, any, any> ? TCol extends Column<TDbType, any, any, any, any, infer TValType, any> ? TValType : never :
    T extends ColumnSQLFunction<TDbType, any, any, infer TRet> ? ClearNull<TRet> :
    never;

export type {
    InferValueTypeFromThisType
}