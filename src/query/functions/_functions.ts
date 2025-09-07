import type { DbType, DbValueTypes, PgDbType } from "../../db.js";
import type { PgValueTypes } from "../../postgresql/dataTypes.js";
import type Column from "../../table/column.js";
import type { GetColumnValueTypes } from "../../table/types/utils.js";
import type { InferParamsFromFn, InferParamsFromFnArgs } from "../_types/result.js";
import type { IComparable } from "../comparisons/_interfaces/IComparable.js";
import between from "../comparisons/between.js";
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
        IComparable<TDbType, any, NonNullable<TReturnType>, any>
    )[],
    TReturnType extends GetColumnValueTypes<TDbType> | null
> implements IComparable<TDbType, InferParamsFromFnArgs<TArgs>, NonNullable<TReturnType>, TReturnType> {

    icomparableValueDummy?: NonNullable<TReturnType>;
    icomparableFinalValueDummy?: TReturnType;
    params?: InferParamsFromFnArgs<TArgs>;

    eq: typeof eq = eq;
    between: typeof between = between;

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