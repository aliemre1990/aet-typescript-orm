import type { DbType, PgDbType } from "../../db.js";
import type { PgValueTypes } from "../../postgresql/dataTypes.js";
import { QueryParamMedian } from "../param.js";
import QueryParam from "../param.js";
import type QueryColumn from "../queryColumn.js";
import ColumnSQLFunction, { sqlFunctions } from "./_functions.js";

type ConvertMedianToParam<T, TDbType extends DbType, TValueType extends TDbType extends PgDbType ? PgValueTypes : never> =
    T extends QueryParamMedian<infer U>
    ? QueryParam<TDbType, U, TValueType>
    : T;

type ConvertMediansInArray<T extends any[], TDbType extends DbType, TValueType extends TDbType extends PgDbType ? PgValueTypes : never> = {
    [K in keyof T]: ConvertMedianToParam<T[K], TDbType, TValueType>
};

function pgCoalesce<
    TArgs extends (
        PgValueTypes |
        null |
        QueryParamMedian<any> |
        QueryColumn<PgDbType, any, any, any> |
        ColumnSQLFunction<PgDbType, any, any>
    )[],
>
    (...args: TArgs) {

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg instanceof QueryParamMedian) {
            let tmpArg = new QueryParam(arg.name);

            args[i] = tmpArg;
        }
    }

    return new ColumnSQLFunction(args as ConvertMediansInArray<TArgs, PgDbType, any>, sqlFunctions.coalesce);
}

export default pgCoalesce;