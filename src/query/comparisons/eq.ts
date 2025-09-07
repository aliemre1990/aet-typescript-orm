import type { DbType } from "../../db.js";
import type Column from "../../table/column.js";
import ColumnComparisonOperation, { comparisonOperations } from "./_comparisonOperations.js";
import { QueryParam, QueryParamMedian } from "../queryColumn.js";
import QueryColumn from "../queryColumn.js";
import type ColumnSQLFunction from "../functions/_functions.js";
import type { InferValueTypeFromComparable, InferValueTypeFromThisType } from "./_types/inferValue.js";
import type { IComparable } from "./_interfaces/IComparable.js";

function eq<
    TDbType extends DbType,
    TComparing extends IComparable<TDbType, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TApplied extends IComparable<TDbType, any, TValueType, any>,
>(this: TComparing, value: TApplied): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TApplied],
    undefined
>
function eq<
    TDbType extends DbType,
    TComparing extends IComparable<TDbType, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TParamMedian extends QueryParamMedian<any>,
    TParamName extends TParamMedian extends QueryParamMedian<infer U> ? U : never,
    TParam extends QueryParam<TDbType, TParamName, TValueType | null>,
>(this: TComparing, value: TParamMedian
): ColumnComparisonOperation<
    TDbType,
    TComparing,
    undefined,
    [TParam]
>
function eq<
    TDbType extends DbType,
    TComparing extends IComparable<TDbType, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>
>(this: TComparing, value: TValueType | null): ColumnComparisonOperation<
    TDbType,
    TComparing,
    undefined,
    undefined
>
function eq<
    TDbType extends DbType,
    TComparing extends IComparable<TDbType, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TParamMedian extends QueryParamMedian<any> | undefined,
    TParamName extends (TParamMedian extends QueryParamMedian<infer U> ? U : never) | undefined,
    TApplied extends IComparable<TDbType, any, TValueType, any>,
>
    (this: TComparing, value: TValueType | TParamMedian | TApplied | null) {

    if (value instanceof QueryParamMedian) {
        const param = new QueryParam<TDbType, TParamName extends string ? TParamName : never, TValueType>(value.name);

        return new ColumnComparisonOperation(
            comparisonOperations.eq,
            this,
            [param]
        )
    }

    return new ColumnComparisonOperation(
        comparisonOperations.eq,
        this,
        [value]
    );
}

export default eq;
