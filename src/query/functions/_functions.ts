import type { DbType } from "../../db.js";
import type Column from "../../table/column.js";
import type QueryParam from "../param.js";
import type QueryColumn from "../queryColumn.js";

const sqlFunctions = {
    coalesce: { name: 'COALESCE' },

} as const;


type SQLFunction = (typeof sqlFunctions)[keyof typeof sqlFunctions];


class ColumnFunction<
    TDbType extends DbType,
    TArgs extends QueryParam<TDbType, any, any> | QueryColumn<TDbType, Column<TDbType, any, any, any>, any, any>
> {
    constructor(
        public args: TArgs,
        public sqlFunction: SQLFunction,

    ) { }
}

export default ColumnFunction;

export {
    sqlFunctions
}

export type {
    SQLFunction
}