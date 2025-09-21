import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type { IsAny } from "../../utility/common.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import QueryParam from "../param.js";
import ColumnSQLFunction, { sqlFunctions } from "./_functions.js";
import type { InferFirstTypeFromArgs, IsContainsNonNull } from "./_types/args.js";

type ConvertMedianToParam<T, TDbType extends DbType, TConvert extends DbValueTypes | null> =
    T extends QueryParam<any, infer U, infer TValueType>
    ? QueryParam<TDbType, U, IsAny<TValueType> extends true ? TConvert : TValueType>
    : T;

type ConvertMediansInArray<T extends any[], TDbType extends DbType, TValueType extends DbValueTypes | null> = {
    [K in keyof T]: ConvertMedianToParam<T[K], TDbType, TValueType>
};

type CoalesceArg<TDbType extends DbType, TValueType extends DbValueTypes> =
    | TValueType | null
    | QueryParam<TDbType, string, TValueType | null>
    | IComparable<TDbType, any, TValueType, any, any>;


function generateCoalesceFn<
    TDbType extends DbType
>(dbType: TDbType) {
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