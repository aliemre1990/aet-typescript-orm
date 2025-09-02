import type { DbType } from "../../db.js";
import type { PgValueTypes } from "../../postgresql/dataTypes.js";
import { QueryParamMedian } from "../param.js";
import QueryParam from "../param.js";
import type QueryColumn from "../queryColumn.js";
import ColumnSQLFunction, { sqlFunctions } from "./_functions.js";

type ConvertMedianToParam<T> =
    T extends QueryParamMedian<infer U>
    ? QueryParam<any, U, any>
    : T;

type ConvertMediansInArray<T extends any[]> = {
    [K in keyof T]: ConvertMedianToParam<T[K]>
};

function coalesce<
    TArgs extends (
        PgValueTypes |
        null |
        QueryParamMedian<any> |
        QueryColumn<any, any, any, any> |
        ColumnSQLFunction<any, any, any>
    )[],
    TDbType extends DbType,
>
    (...args: TArgs) {

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg instanceof QueryParamMedian) {
            let tmpArg = new QueryParam(arg.name);

            args[i] = tmpArg;
        }
    }

    return new ColumnSQLFunction(args as ConvertMediansInArray<TArgs>, sqlFunctions.coalesce);
}

export default coalesce;