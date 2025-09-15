import type { DbType, PgDbType } from "../../db.js";
import type { GetArrayEquivalentPgValueType } from "../../postgresql/dataTypes.js";
import { isNullOrUndefined } from "../../utility/guards.js";
import ColumnComparisonOperation, { comparisonOperations } from "./_comparisonOperations.js";
import type { InferValueTypeFromComparable } from "./_types/inferValue.js";
import type { IComparable } from "./_interfaces/IComparable.js";
import type { IsAny, NullableArray } from "../../utility/common.js";
import QueryParam from "../param.js";

// Helper type to extract only QueryColumns from the mixed tuple
type ExtractComparables<T extends readonly unknown[]> =
    T extends readonly [infer First, ...infer Rest] ?
    First extends IComparable<any, any, any, any, any> ?
    [First, ...ExtractComparables<Rest>] :
    ExtractComparables<Rest> :
    [];


function sqlIn<
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TParamMedian extends QueryParam<TDbType, string, any>,
    TParamName extends TParamMedian extends QueryParam<any, infer U, any> ? U : never,
    TParamValue extends TParamMedian extends QueryParam<any, any, infer TVal> ? TVal : never,
    // Find a way to make array nullable
    TParam extends QueryParam<TDbType, TParamName, (IsAny<TParamValue> extends true ? NullableArray<GetArrayEquivalentPgValueType<TValueType>> | null : TParamValue)>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any> ? DbType : never
>(this: TComparing, param: TParamMedian
): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TParam]
>
function sqlIn<
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TValues extends readonly (TValueType | IComparable<TDbType, any, TValueType, any, any>)[],
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any> ? DbType : never
>(
    this: TComparing,
    ...values: TValues
): ColumnComparisonOperation<
    TDbType,
    TComparing,
    ExtractComparables<TValues>["length"] extends 0 ? undefined : ExtractComparables<TValues> // Helper type to extract only the columns as tuple
>


function sqlIn<
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TParamMedian extends QueryParam<TDbType, string, any> | undefined,
    TParamName extends TParamMedian extends QueryParam<any, infer U, any> ? U : never,
    TParamValue extends TParamMedian extends QueryParam<any, any, infer TVal> ? TVal : never,
    TValues extends readonly (TValueType | IComparable<TDbType, any, TValueType, any, any>)[],
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any> ? DbType : never
>
    (
        this: TComparing,
        param: TParamMedian | TValues[number],
        ...values: TValues
    ) {

    if (isNullOrUndefined(param)) {
        throw Error('In operation requires at least one value.');
    }

    if (param instanceof QueryParam) {
        const paramRes = new QueryParam<
            TDbType,
            TParamName,
            IsAny<TParamValue> extends true ? NullableArray<GetArrayEquivalentPgValueType<TValueType>> : TParamValue
        >(param.name, param.dbType);

        return new ColumnComparisonOperation(
            comparisonOperations.in,
            this,
            [paramRes]
        )
    }

    return new ColumnComparisonOperation
        (
            comparisonOperations.in,
            this,
            [param, ...values]
        );
}

export default sqlIn;
