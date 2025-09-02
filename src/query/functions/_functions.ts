import type { DbType } from "../../db.js";
import type { PgValueTypes } from "../../postgresql/dataTypes.js";
import type Column from "../../table/column.js";
import type QueryParam from "../param.js";
import type QueryColumn from "../queryColumn.js";
import functionEq from "./comparisonOps/eq.js";

const sqlFunctions = {
    coalesce: { name: 'COALESCE' },

} as const;


type SQLFunction = (typeof sqlFunctions)[keyof typeof sqlFunctions];


class ColumnSQLFunction<
    TDbType extends DbType,
    TArgs extends (
        PgValueTypes | null |
        QueryParam<TDbType, any, any> |
        QueryColumn<TDbType, Column<TDbType, any, any, any>, any, any> |
        ColumnSQLFunction<TDbType, any, TReturnType>
    )[],
    TReturnType extends PgValueTypes | null
> {

    eq: typeof functionEq = functionEq;

    constructor(
        public args: TArgs,
        public sqlFunction: SQLFunction,

    ) { }
}

export default ColumnSQLFunction;

export {
    sqlFunctions
}

export type {
    SQLFunction
}