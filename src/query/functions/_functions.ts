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
    jsonBuildObject: { name: 'JSON_BUILD_OBJECT' }

} as const;


type SQLFunction = (typeof sqlFunctions)[keyof typeof sqlFunctions];


class ColumnSQLFunction<
    TDbType extends DbType,
    TSQLFunction extends SQLFunction,
    TArgs extends (
        PgValueTypes | null |
        QueryParam<TDbType, any, any> |
        IComparable<TDbType, any, NonNullable<TReturnType>, any, any, any>
    )[],
    TReturnType extends GetColumnValueTypes<TDbType> | null,
    TAsName extends string | undefined,
    TIsAgg extends boolean = false
> implements IComparable<TDbType, InferParamsFromFnArgs<TArgs>, NonNullable<TReturnType>, TReturnType, TAsName, TIsAgg> {

    icomparableValueDummy?: NonNullable<TReturnType>;
    icomparableFinalValueDummy?: TReturnType;
    params?: InferParamsFromFnArgs<TArgs>;
    asName?: TAsName;
    isAgg?: TIsAgg;
    dbType?: TDbType;


    eq: typeof eq = eq;
    between: typeof between = between;

    constructor(
        public args: TArgs,
        public sqlFunction: TSQLFunction,
        asName?: TAsName
    ) {
        this.asName = asName;
    }

    as<TAsName extends string>(asName: TAsName) {
        return new ColumnSQLFunction<TDbType, TSQLFunction, TArgs, TReturnType, TAsName, TIsAgg>(this.args, this.sqlFunction, asName);
    }
}

export default ColumnSQLFunction;

export {
    sqlFunctions
}

export type {
    SQLFunction
}