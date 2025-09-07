import type { DbType, PgDbType } from "../../db.js";
import type { JsTypeToPgTypes, PgValueTypes } from "../../postgresql/dataTypes.js";
import type Column from "../../table/column.js";
import type { IComparable } from "../comparisons/_interfaces/IComparable.js";
import { QueryParamMedian } from "../param.js";
import QueryParam from "../param.js";
import type QueryColumn from "../queryColumn.js";
import ColumnSQLFunction, { sqlFunctions } from "./_functions.js";
import type { InferFirstTypeFromArgs, IsContainsNonNull } from "./_types/args.js";

type ConvertMedianToParam<T, TDbType extends DbType, TValueType extends (TDbType extends PgDbType ? PgValueTypes : never) | null> =
    T extends QueryParamMedian<infer U>
    ? QueryParam<TDbType, U, TValueType>
    : T;

type ConvertMediansInArray<T extends any[], TDbType extends DbType, TValueType extends (TDbType extends PgDbType ? PgValueTypes : never) | null> = {
    [K in keyof T]: ConvertMedianToParam<T[K], TDbType, TValueType>
};

type CoalesceArg<TDbType extends DbType, TValueType extends ((TDbType extends PgDbType ? PgValueTypes : never))> =
    | TValueType | null
    | QueryParamMedian<any>
    | IComparable<TDbType, any, TValueType, any>;

function pgCoalesce<
    TArgs extends any[],
    TValueType extends PgValueTypes | null = InferFirstTypeFromArgs<PgDbType, TArgs> | null
>
    (...args: TArgs & (TArgs extends CoalesceArg<PgDbType, NonNullable<TValueType>>[] ? TArgs : never)) {

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg instanceof QueryParamMedian) {
            let tmpArg = new QueryParam(arg.name);

            args[i] = tmpArg;
        }
    }

    return new ColumnSQLFunction<
        PgDbType,
        typeof sqlFunctions.coalesce,
        ConvertMediansInArray<TArgs, PgDbType, TValueType>,
        IsContainsNonNull<PgDbType, TArgs> extends true ? NonNullable<TValueType> : TValueType
    >(args as ConvertMediansInArray<TArgs, PgDbType, TValueType>, sqlFunctions.coalesce);
}

export default pgCoalesce;