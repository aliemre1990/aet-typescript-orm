import type { DbType } from "../../db.js";
import ColumnComparisonOperation, { comparisonOperations } from "./_comparisonOperations.js";
import type { InferValueTypeFromComparable } from "./_types/inferValue.js";
import type { IComparable } from "./_interfaces/IComparable.js";
import type { IsAny } from "../../utility/common.js";
import QueryParam from "../param.js";



// params
function between<
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TLParamMedian extends QueryParam<TDbType, string, any>,
    TLParamName extends TLParamMedian extends QueryParam<any, infer U, any> ? U : never,
    TLParamValue extends TLParamMedian extends QueryParam<any, any, infer TVal> ? TVal : never,
    TLParam extends QueryParam<TDbType, TLParamName, IsAny<TLParamValue> extends true ? TValueType | null : TLParamValue>,
    TRParamMedian extends QueryParam<TDbType, string, any>,
    TRParamName extends TRParamMedian extends QueryParam<any, infer U, any> ? U : never,
    TRParamValue extends TRParamMedian extends QueryParam<any, any, infer TVal> ? TVal : never,
    TRParam extends QueryParam<TDbType, TRParamName, IsAny<TRParamValue> extends true ? TValueType | null : TRParamValue>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any> ? DbType : never
>(this: TComparing, leftValue: TLParamMedian, rightValue: TRParamMedian
): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TLParam, TRParam]
>
function between<
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TLParamMedian extends QueryParam<TDbType, string, any>,
    TLParamName extends TLParamMedian extends QueryParam<any, infer U, any> ? U : never,
    TLParamValue extends TLParamMedian extends QueryParam<any, any, infer TVal> ? TVal : never,
    TLParam extends QueryParam<TDbType, TLParamName, IsAny<TLParamValue> extends true ? TValueType | null : TLParamValue>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any> ? DbType : never
>(this: TComparing, leftValue: TLParamMedian, rightValue: TValueType | null): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TLParam]
>
function between<
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TRParamMedian extends QueryParam<TDbType, string, any>,
    TRParamName extends TRParamMedian extends QueryParam<any, infer U, any> ? U : never,
    TRParamValue extends TRParamMedian extends QueryParam<any, any, infer TVal> ? TVal : never,
    TRParam extends QueryParam<TDbType, TRParamName, IsAny<TRParamValue> extends true ? TValueType | null : TRParamValue>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any> ? DbType : never
>(this: TComparing, leftValue: TValueType | null, rightValue: TRParamMedian): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TRParam]
>
function between<
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TLParamMedian extends QueryParam<TDbType, string, any>,
    TLParamName extends TLParamMedian extends QueryParam<any, infer U, any> ? U : never,
    TLParamValue extends TLParamMedian extends QueryParam<any, any, infer TVal> ? TVal : never,
    TLParam extends QueryParam<TDbType, TLParamName, IsAny<TLParamValue> extends true ? TValueType | null : TLParamValue>,
    TRApplied extends IComparable<TDbType, any, TValueType, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any> ? DbType : never
>(this: TComparing, leftValue: TLParamMedian, rightValue: TRApplied): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TLParam, TRApplied]
>
function between<
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TRParamMedian extends QueryParam<TDbType, string, any>,
    TRParamName extends TRParamMedian extends QueryParam<any, infer U, any> ? U : never,
    TRParamValue extends TRParamMedian extends QueryParam<any, any, infer TVal> ? TVal : never,
    TRParam extends QueryParam<TDbType, TRParamName, IsAny<TRParamValue> extends true ? TValueType | null : TRParamValue>,
    TLApplied extends IComparable<TDbType, any, TValueType, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any> ? DbType : never
>(this: TComparing, leftValue: TLApplied, rightValue: TRParamMedian): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TLApplied, TRParam]
>


// All same
function between<
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any> ? DbType : never
>(this: TComparing, leftValue: TValueType | null, rightValue: TValueType | null): ColumnComparisonOperation<
    TDbType,
    TComparing,
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
    [TLApplied, TRApplied]
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
    [TLApplied]
>
function between<
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TRApplied extends IComparable<TDbType, any, TValueType, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any> ? DbType : never
>(this: TComparing, leftValue: TValueType | null, rightValue: TRApplied): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TRApplied]
>


//Implementation
function between<
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TLParamMedian extends QueryParam<TDbType, string, any> | undefined,
    TLParamName extends (TLParamMedian extends QueryParam<any, infer U, any> ? U : never) | undefined,
    TLParamValue extends TLParamMedian extends QueryParam<any, any, infer TVal> ? TVal : never,
    TRParamMedian extends QueryParam<TDbType, string, any> | undefined,
    TRParamName extends (TRParamMedian extends QueryParam<any, infer U, any> ? U : never) | undefined,
    TRParamValue extends TRParamMedian extends QueryParam<any, any, infer TVal> ? TVal : never,
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
        const lParam = new QueryParam<
            TDbType,
            TLParamName extends string ? TLParamName : never,
            IsAny<TLParamValue> extends true ? TValueType | null : TLParamValue
        >(leftValue.name, leftValue.dbType);

        if (rightValue instanceof QueryParam) {
            const rParam = new QueryParam<
                TDbType,
                TRParamName extends string ? TRParamName : never,
                IsAny<TRParamValue> extends true ? TValueType | null : TRParamValue
            >(rightValue.name, leftValue.dbType);

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
        const rParam = new QueryParam<
            TDbType,
            TRParamName extends string ? TRParamName : never,
            IsAny<TRParamValue> extends true ? TValueType | null : TRParamValue
        >(rightValue.name, leftValue.dbType);

        if (leftValue instanceof QueryParam) {
            const lParam = new QueryParam<
                TDbType,
                TLParamName extends string ? TLParamName : never,
                IsAny<TLParamValue> extends true ? TValueType | null : TLParamValue
            >(leftValue.name, leftValue.dbType);

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
