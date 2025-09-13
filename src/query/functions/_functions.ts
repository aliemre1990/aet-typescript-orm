import type { DbType, DbValueTypes } from "../../db.js";
import type { IComparable } from "../comparisons/_interfaces/IComparable.js";
import between from "../comparisons/between.js";
import eq from "../comparisons/eq.js";
import type QueryParam from "../param.js";
import type { InferParamsFromFnArgs } from "./_types/inferParamsFromArgs.js";

const sqlFunctions = {
    coalesce: { name: 'COALESCE' },
    round: { name: 'ROUND' },
    jsonBuildObject: { name: 'JSON_BUILD_OBJECT' }

} as const;


type SQLFunction = (typeof sqlFunctions)[keyof typeof sqlFunctions];


class ColumnSQLFunction<
    TDbType extends DbType,
    TSQLFunction extends SQLFunction,
    TArgs extends (
        DbValueTypes | null |
        IComparable<TDbType, any, any, any, any>
    )[],
    TReturnType extends DbValueTypes | null,
    TIsAgg extends boolean = false
> implements IComparable<TDbType, InferParamsFromFnArgs<TArgs>, NonNullable<TReturnType>, TReturnType, TIsAgg> {

    icomparableValueDummy?: NonNullable<TReturnType>;
    icomparableFinalValueDummy?: TReturnType;
    params?: InferParamsFromFnArgs<TArgs>;
    isAgg?: TIsAgg;


    eq: typeof eq = eq;
    between: typeof between = between;

    constructor(
        public dbType: TDbType,
        public args: TArgs,
        public sqlFunction: TSQLFunction,
    ) {
    }
}

export default ColumnSQLFunction;

export {
    sqlFunctions
}

export type {
    SQLFunction
}