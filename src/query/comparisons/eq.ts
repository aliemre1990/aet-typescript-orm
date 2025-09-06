import type { DbType } from "../../db.js";
import type Column from "../../table/column.js";
import ColumnComparisonOperation, { comparisonOperations } from "./_comparisonOperations.js";
import { QueryParam, QueryParamMedian } from "../queryColumn.js";
import QueryColumn from "../queryColumn.js";
import type ColumnSQLFunction from "../functions/_functions.js";
import type { InferValueTypeFromThisType } from "./_types/inferValueTypeFromThisType.js";

function eq<
    TDbType extends DbType,
    TComparing extends QueryColumn<TDbType, any, any, any> | ColumnSQLFunction<TDbType, any, any, any>,
    TValueType extends InferValueTypeFromThisType<TDbType, TComparing>,
    TAppliedQColumn extends QueryColumn<TDbType, Column<TDbType, any, any, any, any, TValueType>, any, any>,
>(this: TComparing, value: TAppliedQColumn): ColumnComparisonOperation<
    TDbType,
    TComparing,
    undefined,
    [TAppliedQColumn],
    undefined
>
function eq<
    TDbType extends DbType,
    TComparing extends QueryColumn<TDbType, any, any, any> | ColumnSQLFunction<TDbType, any, any, any>,
    TValueType extends InferValueTypeFromThisType<TDbType, TComparing>,
    TAppliedSQLFunction extends ColumnSQLFunction<TDbType, any, any, TValueType | null>
>(this: TComparing, value: TAppliedSQLFunction): ColumnComparisonOperation<
    TDbType,
    TComparing,
    undefined,
    undefined,
    [TAppliedSQLFunction]
>
function eq<
    TDbType extends DbType,
    TComparing extends QueryColumn<TDbType, any, any, any> | ColumnSQLFunction<TDbType, any, any, any>,
    TValueType extends InferValueTypeFromThisType<TDbType, TComparing>,
    TParamMedian extends QueryParamMedian<any>,
    TParamName extends TParamMedian extends QueryParamMedian<infer U> ? U : never,
    TParam extends QueryParam<TDbType, TParamName, TValueType | null>,
>(this: TComparing, value: TParamMedian
): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TParam],
    undefined,
    undefined
>
function eq<
    TDbType extends DbType,
    TComparing extends QueryColumn<TDbType, any, any, any> | ColumnSQLFunction<TDbType, any, any, any>,
    TValueType extends InferValueTypeFromThisType<TDbType, TComparing>,
>(this: TComparing, value: TValueType | null): ColumnComparisonOperation<
    TDbType,
    TComparing,
    undefined,
    undefined,
    undefined
>
function eq<
    TDbType extends DbType,
    TComparing extends QueryColumn<TDbType, any, any, any> | ColumnSQLFunction<TDbType, any, any, any>,
    TValueType extends InferValueTypeFromThisType<TDbType, TComparing>,
    TParamMedian extends QueryParamMedian<any> | undefined,
    TParamName extends (TParamMedian extends QueryParamMedian<infer U> ? U : never) | undefined,
    TAppliedQColumn extends QueryColumn<TDbType, Column<TDbType, any, any, any, any, TValueType>, any, any> | undefined,
    TAppliedSQLFunction extends ColumnSQLFunction<TDbType, any, any, TValueType | null> | undefined
>
    (this: TComparing, value: TValueType | TParamMedian | TAppliedQColumn | TAppliedSQLFunction | null) {

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
