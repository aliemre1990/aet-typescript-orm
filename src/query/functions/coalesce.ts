import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type { IsAny } from "../../utility/common.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import QueryParam from "../param.js";
import ColumnSQLFunction, { sqlFunctions } from "./_functions.js";
import type { InferFirstTypeFromArgs, IsContainsNonNull } from "../_types/args.js";

type ConvertMedianToParam<T, TDbType extends DbType, TConvert extends DbValueTypes | null> =
    T extends QueryParam<any, infer U, infer TValueType, infer TAs, infer TDefaultFieldKey, infer TId>
    ? QueryParam<TDbType, U, IsAny<TValueType> extends true ? TConvert : TValueType, TAs, TDefaultFieldKey, TId>
    : T;

type ConvertMediansInArray<T extends any[], TDbType extends DbType, TValueType extends DbValueTypes | null> = {
    [K in keyof T]: ConvertMedianToParam<T[K], TDbType, TValueType>
};

type CoalesceArg<TDbType extends DbType, TValueType extends DbValueTypes> =
    | TValueType | null
    | QueryParam<TDbType, string, TValueType | null, any, any, any>
    | IComparable<TDbType, any, any, TValueType, any, any, any, any>;


function generateCoalesceFn<
    TDbType extends DbType
>(dbType: TDbType):
    <TArgs extends any[]>(
        ...args: TArgs & (TArgs extends CoalesceArg<TDbType, NonNullable<InferFirstTypeFromArgs<TDbType, TArgs>>>[] ? TArgs : never)
    ) => ColumnSQLFunction<
        TDbType,
        typeof sqlFunctions.coalesce,
        ConvertMediansInArray<TArgs, TDbType, InferFirstTypeFromArgs<TDbType, TArgs> | null>,
        IsContainsNonNull<TDbType, TArgs> extends true ? NonNullable<InferFirstTypeFromArgs<TDbType, TArgs>> : InferFirstTypeFromArgs<TDbType, TArgs> | null
    > {
    return <
        TArgs extends any[]
    >
        (...args: TArgs & (TArgs extends CoalesceArg<TDbType, NonNullable<InferFirstTypeFromArgs<TDbType, TArgs>>>[] ? TArgs : never)) => {

        // Dont move this to type arguments of the function, let it  stay here
        type FirstType = InferFirstTypeFromArgs<TDbType, TArgs>;

        return new ColumnSQLFunction<
            TDbType,
            typeof sqlFunctions.coalesce,
            ConvertMediansInArray<TArgs, TDbType, FirstType | null>,
            IsContainsNonNull<TDbType, TArgs> extends true ? NonNullable<FirstType> : FirstType | null
        >(dbType, args as ConvertMediansInArray<TArgs, TDbType, FirstType | null>, sqlFunctions.coalesce);
    }
}

export {
    generateCoalesceFn
}