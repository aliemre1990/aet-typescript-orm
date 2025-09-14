import type { DbType, DbValueTypes } from "../../db.js";
import type { IComparable } from "../comparisons/_interfaces/IComparable.js";
import QueryParam from "../param.js";
import ColumnSQLFunction, { sqlFunctions } from "./_functions.js";
import type { InferFirstTypeFromArgs, IsContainsNonNull } from "./_types/args.js";

type ConvertMedianToParam<T, TDbType extends DbType, TValueType extends DbValueTypes | null> =
    T extends QueryParam<any, infer U, any>
    ? QueryParam<TDbType, U, TValueType>
    : T;

type ConvertMediansInArray<T extends any[], TDbType extends DbType, TValueType extends DbValueTypes | null> = {
    [K in keyof T]: ConvertMedianToParam<T[K], TDbType, TValueType>
};

type CoalesceArg<TDbType extends DbType, TValueType extends DbValueTypes> =
    | TValueType | null
    | QueryParam<TDbType, string, any>
    | IComparable<TDbType, any, TValueType, any, any>;


function generateCoalesceFn<
    TDbType extends DbType
>(dbType: TDbType) {
    return <
        TArgs extends any[],
        TValueType extends DbValueTypes | null = InferFirstTypeFromArgs<TDbType, TArgs> | null
    >
        (...args: TArgs & (TArgs extends CoalesceArg<TDbType, NonNullable<TValueType>>[] ? TArgs : never)) => {

        return new ColumnSQLFunction<
            TDbType,
            typeof sqlFunctions.coalesce,
            ConvertMediansInArray<TArgs, TDbType, TValueType>,
            IsContainsNonNull<TDbType, TArgs> extends true ? NonNullable<TValueType> : TValueType
        >(dbType, args as ConvertMediansInArray<TArgs, TDbType, TValueType>, sqlFunctions.coalesce);
    }
}

export {
    generateCoalesceFn
}