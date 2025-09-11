import type { DbType, PgDbType } from "../../db.js";
import type { GetArrayEquivalentPgValueType } from "../../postgresql/dataTypes.js";
import { isNullOrUndefined } from "../../utility/guards.js";
import ColumnComparisonOperation, { comparisonOperations } from "./_comparisonOperations.js";
import { QueryParam } from "../queryColumn.js";
import QueryColumn from "../queryColumn.js";
import type ColumnSQLFunction from "../functions/_functions.js";
import type { InferValueTypeFromComparable, InferValueTypeFromThisType } from "./_types/inferValue.js";
import type { IComparable } from "./_interfaces/IComparable.js";

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
    TParam extends QueryParam<TDbType, TParamName, TDbType extends PgDbType ? GetArrayEquivalentPgValueType<TValueType> : never>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any> ? DbType : never
>(this: TComparing, param: TParamMedian
): ColumnComparisonOperation<
    TDbType,
    TComparing,
    undefined,
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
    ExtractComparables<TValues>["length"] extends 0 ? undefined : ExtractComparables<TValues>, // Helper type to extract only the columns as tuple
    undefined
>


function sqlIn<
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TParamMedian extends QueryParam<TDbType, string, any> | undefined,
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
        const paramRes = new QueryParam(param.name);

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
