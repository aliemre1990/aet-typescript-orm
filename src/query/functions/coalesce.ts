import type { DbType, PgDbType } from "../../db.js";
import type { JsTypeToPgTypes, PgValueTypes } from "../../postgresql/dataTypes.js";
import type Column from "../../table/column.js";
import { QueryParamMedian } from "../param.js";
import QueryParam from "../param.js";
import type QueryColumn from "../queryColumn.js";
import ColumnSQLFunction, { sqlFunctions } from "./_functions.js";
import type { InferFirstTypeFromArgs } from "./_types/args.js";

type ConvertMedianToParam<T, TDbType extends DbType, TValueType extends TDbType extends PgDbType ? PgValueTypes : never> =
    T extends QueryParamMedian<infer U>
    ? QueryParam<TDbType, U, TValueType>
    : T;

type ConvertMediansInArray<T extends any[], TDbType extends DbType, TValueType extends TDbType extends PgDbType ? PgValueTypes : never> = {
    [K in keyof T]: ConvertMedianToParam<T[K], TDbType, TValueType>
};

type CoalesceArg<TDbType extends DbType, TValueType extends ((TDbType extends PgDbType ? PgValueTypes : never) | null)> =
    | TValueType
    | QueryParamMedian<any>
    | QueryColumn<TDbType, any, any, any>
    | ColumnSQLFunction<TDbType, any, any, TValueType>;

function pgCoalesce<
    TArgs extends any[],
    TValueType extends PgValueTypes | null = InferFirstTypeFromArgs<PgDbType, TArgs> | null
>
    (...args: TArgs & (TArgs extends CoalesceArg<PgDbType, TValueType>[] ? TArgs : never)) {

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