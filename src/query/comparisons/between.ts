import type { DbType } from "../../db.js";
import ColumnComparisonOperation, { comparisonOperations } from "./_comparisonOperations.js";
import { QueryParam } from "../queryColumn.js";
import type { InferValueTypeFromComparable } from "./_types/inferValue.js";
import type { IComparable } from "./_interfaces/IComparable.js";



// params
function between<
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TLParamMedian extends QueryParam<TDbType, string, any>,
    TLParamName extends TLParamMedian extends QueryParam<any, infer U, any> ? U : never,
    TLParam extends QueryParam<TDbType, TLParamName, TValueType | null>,
    TRParamMedian extends QueryParam<TDbType, string, any>,
    TRParamName extends TRParamMedian extends QueryParam<any, infer U, any> ? U : never,
    TRParam extends QueryParam<TDbType, TRParamName, TValueType | null>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any> ? DbType : never
>(this: TComparing, leftValue: TLParamMedian, rightValue: TRParamMedian
): ColumnComparisonOperation<
    TDbType,
    TComparing,
    undefined,
    [TLParam, TRParam]
>
function between<
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TLParamMedian extends QueryParam<TDbType, string, any>,
    TLParamName extends TLParamMedian extends QueryParam<any, infer U, any> ? U : never,
    TLParam extends QueryParam<TDbType, TLParamName, TValueType | null>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any> ? DbType : never
>(this: TComparing, leftValue: TLParamMedian, rightValue: TValueType | null): ColumnComparisonOperation<
    TDbType,
    TComparing,
    undefined,
    [TLParam]
>
function between<
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TRParamMedian extends QueryParam<TDbType, string, any>,
    TRParamName extends TRParamMedian extends QueryParam<any, infer U, any> ? U : never,
    TRParam extends QueryParam<TDbType, TRParamName, TValueType | null>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any> ? DbType : never
>(this: TComparing, leftValue: TValueType | null, rightValue: TRParamMedian): ColumnComparisonOperation<
    TDbType,
    TComparing,
    undefined,
    [TRParam]
>
function between<
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TLParamMedian extends QueryParam<TDbType, string, any>,
    TLParamName extends TLParamMedian extends QueryParam<any, infer U, any> ? U : never,
    TLParam extends QueryParam<TDbType, TLParamName, TValueType | null>,
    TRApplied extends IComparable<TDbType, any, TValueType, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any> ? DbType : never
>(this: TComparing, leftValue: TLParamMedian, rightValue: TRApplied): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TRApplied],
    [TLParam]
>
function between<
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TRParamMedian extends QueryParam<TDbType, string, any>,
    TRParamName extends TRParamMedian extends QueryParam<any, infer U, any> ? U : never,
    TRParam extends QueryParam<TDbType, TRParamName, TValueType | null>,
    TLApplied extends IComparable<TDbType, any, TValueType, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any> ? DbType : never
>(this: TComparing, leftValue: TLApplied, rightValue: TRParamMedian): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TLApplied],
    [TRParam]
>


// All same
function between<
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any> ? DbType : never
>(this: TComparing, leftValue: TValueType | null, rightValue: TValueType | null): ColumnComparisonOperation<
    TDbType,
    TComparing,
    undefined,
    undefined
>
function between<
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TLApplied extends IComparable<TDbType, any, TValueType, any, any>,
    TRApplied extends IComparable<TDbType, any, TValueType, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any> ? DbType : never
>(this: TComparing, leftValue: TLApplied, rightValue: TRApplied): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TLApplied, TRApplied],
    undefined
>



// Column and value
function between<
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TLApplied extends IComparable<TDbType, any, TValueType, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any> ? DbType : never
>(this: TComparing, leftValue: TLApplied, rightValue: TValueType | null): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TLApplied],
    undefined
>
function between<
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TRApplied extends IComparable<TDbType, any, TValueType, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any> ? DbType : never
>(this: TComparing, leftValue: TValueType | null, rightValue: TRApplied): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TRApplied],
    undefined
>


//Implementation
function between<
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TLParamMedian extends QueryParam<TDbType, string, any> | undefined,
    TLParamName extends (TLParamMedian extends QueryParam<any, infer U, any> ? U : never) | undefined,
    TRParamMedian extends QueryParam<TDbType, string, any> | undefined,
    TRParamName extends (TRParamMedian extends QueryParam<any, infer U, any> ? U : never) | undefined,
    TLApplied extends IComparable<TDbType, any, TValueType, any, any> | undefined,
    TRApplied extends IComparable<TDbType, any, TValueType, any, any> | undefined,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any> ? DbType : never
>
    (
        this: TComparing,
        leftValue: TValueType | null | TLParamMedian | TLApplied,
        rightValue: TValueType | null | TRParamMedian | TRApplied
    ) {

    if (leftValue instanceof QueryParam) {
        const lParam = new QueryParam<TDbType, TLParamName extends string ? TLParamName : never, TValueType | null>(leftValue.name);

        if (rightValue instanceof QueryParam) {
            const rParam = new QueryParam<TDbType, TRParamName extends string ? TRParamName : never, TValueType | null>(rightValue.name);

            return new ColumnComparisonOperation(
                comparisonOperations.between,
                this,
                [lParam, rParam]
            )
        }

        return new ColumnComparisonOperation(
            comparisonOperations.between,
            this,
            [lParam, rightValue]
        )

    }

    if (rightValue instanceof QueryParam) {
        const rParam = new QueryParam<TDbType, TRParamName extends string ? TRParamName : never, TValueType | null>(rightValue.name);

        if (leftValue instanceof QueryParam) {
            const lParam = new QueryParam<TDbType, TLParamName extends string ? TLParamName : never, TValueType | null>(leftValue.name);

            return new ColumnComparisonOperation(
                comparisonOperations.between,
                this,
                [lParam, rParam]
            );
        }

        return new ColumnComparisonOperation(
            comparisonOperations.between,
            this,
            [leftValue, rParam]
        );

    }

    return new ColumnComparisonOperation(
        comparisonOperations.between,
        this,
        [leftValue, rightValue]
    );
}

export default between;
