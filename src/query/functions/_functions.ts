import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import between from "../comparisons/between.js";
import eq from "../comparisons/eq.js";
import sqlIn from "../comparisons/in.js";
import type { InferParamsFromFnArgs } from "../_types/inferParamsFromArgs.js";

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
        IComparable<TDbType, any, any, any, any, any>
    )[],
    TReturnType extends DbValueTypes | null,
    TIsAgg extends boolean = false,
    TAs extends string | undefined = undefined
> implements IComparable<TDbType, InferParamsFromFnArgs<TArgs>, NonNullable<TReturnType>, TReturnType, TIsAgg, TAs> {

    icomparableValueDummy?: NonNullable<TReturnType>;
    icomparableFinalValueDummy?: TReturnType;
    params?: InferParamsFromFnArgs<TArgs>;
    isAgg?: TIsAgg;

    asName?: TAs;

    eq: typeof eq = eq;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;

    as<TAs extends string>(asName: TAs) {
        return new ColumnSQLFunction<TDbType, TSQLFunction, TArgs, TReturnType, TIsAgg, TAs>(this.dbType, this.args, this.sqlFunction, asName);
    }

    constructor(
        public dbType: TDbType,
        public args: TArgs,
        public sqlFunction: TSQLFunction,
        asName?: TAs
    ) {
        this.asName = asName;
    }
}

export default ColumnSQLFunction;

export {
    sqlFunctions
}

export type {
    SQLFunction
}