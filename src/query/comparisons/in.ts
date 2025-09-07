import type { DbType, PgDbType } from "../../db.js";
import type { GetArrayEquivalentPgValueType, JsTypeToPgTypes } from "../../postgresql/dataTypes.js";
import type Column from "../../table/column.js";
import type { ColumnType, QueryTableSpecsType } from "../../table/types/utils.js";
import { isNullOrUndefined } from "../../utility/guards.js";
import type { GetColumnTypeFromDbType, GetColumnValueType } from "../_types/miscellaneous.js";
import ColumnComparisonOperation, { comparisonOperations } from "./_comparisonOperations.js";
import { QueryParam, QueryParamMedian } from "../queryColumn.js";
import QueryColumn from "../queryColumn.js";
import type ColumnSQLFunction from "../functions/_functions.js";
import type { InferValueTypeFromThisType } from "./_types/inferValueTypeFromThisType.js";
import type { IComparable } from "./_interfaces/IComparable.js";

// Helper type to extract only QueryColumns from the mixed tuple
type ExtractComparables<T extends readonly unknown[]> =
    T extends readonly [infer First, ...infer Rest] ?
    First extends IComparable<any, any, any> ?
    [First, ...ExtractComparables<Rest>] :
    ExtractComparables<Rest> :
    [];

function sqlIn<
    TDbType extends DbType,
    TComparing extends QueryColumn<TDbType, any, any, any> | ColumnSQLFunction<TDbType, any, any, any>,
    TValueType extends InferValueTypeFromThisType<TDbType, TComparing>,
    TValues extends readonly (TValueType | IComparable<TDbType, any, TValueType>)[]
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
    TDbType extends DbType,
    TComparing extends QueryColumn<TDbType, any, any, any> | ColumnSQLFunction<TDbType, any, any, any>,
    TValueType extends InferValueTypeFromThisType<TDbType, TComparing>,
    TParamMedian extends QueryParamMedian<any>,
    TParamName extends TParamMedian extends QueryParamMedian<infer U> ? U : never,
    TParam extends QueryParam<TDbType, TParamName, TDbType extends PgDbType ? GetArrayEquivalentPgValueType<TValueType> : never>,
>(this: TComparing, param: TParamMedian
): ColumnComparisonOperation<
    TDbType,
    TComparing,
    undefined,
    [TParam]
>
function sqlIn<
    TDbType extends DbType,
    TComparing extends QueryColumn<TDbType, any, any, any> | ColumnSQLFunction<TDbType, any, any, any>,
    TValueType extends InferValueTypeFromThisType<TDbType, TComparing>,
    TParamMedian extends QueryParamMedian<any> | undefined,
    TValues extends readonly (TValueType | IComparable<TDbType, any, TValueType>)[]
>
    (
        this: TComparing,
        param: TParamMedian | TValues[number],
        ...values: TValues
    ) {

    if (isNullOrUndefined(param)) {
        throw Error('In operation requires at least one value.');
    }

    if (param instanceof QueryParamMedian) {
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
