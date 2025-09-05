import type { DbType, DbValueTypes, PgDbType } from "../../db.js";
import type { PgValueTypes } from "../../postgresql/dataTypes.js";
import type Column from "../../table/column.js";
import eq from "../comparisons/eq.js";
import type QueryParam from "../param.js";
import type QueryColumn from "../queryColumn.js";

const sqlFunctions = {
    coalesce: { name: 'COALESCE' },

} as const;


type SQLFunction = (typeof sqlFunctions)[keyof typeof sqlFunctions];


class ColumnSQLFunction<
    TDbType extends DbType,
    TSQLFunction extends SQLFunction,
    TArgs extends (
        PgValueTypes | null |
        QueryParam<TDbType, any, any> |
        QueryColumn<TDbType, Column<TDbType, any, any, any, any>, any, any> |
        ColumnSQLFunction<TDbType, any, any, TReturnType>
    )[],
    TReturnType extends (TDbType extends PgDbType ? PgValueTypes : never) | null
> {

    dummyProp?: TReturnType;

    eq: typeof eq = eq;

    constructor(
        public args: TArgs,
        public sqlFunction: TSQLFunction,

    ) { }
}

export default ColumnSQLFunction;

export {
    sqlFunctions
}

export type {
    SQLFunction
}