import type { DbType } from "../../db.js";
import ColumnComparisonOperation, { comparisonOperations, type InferValueTypeFromComparable } from "./_comparisonOperations.js";

import type { IComparable } from "../_interfaces/IComparable.js";
import type { IsAny, LiteralToBase } from "../../utility/common.js";
import QueryParam from "../param.js";



// params
function between<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TLParamMedian extends QueryParam<TDbType, string, any, any, any, any>,
    TLParamName extends TLParamMedian extends QueryParam<any, infer U, any, any, any, any> ? U : never,
    TLParamValue extends TLParamMedian extends QueryParam<any, any, infer TVal, any, any, any> ? TVal : never,
    TLParam extends QueryParam<TDbType, TLParamName, IsAny<TLParamValue> extends true ? LiteralToBase<TValueType> | null : TLParamValue, any, any, any>,
    TRParamMedian extends QueryParam<TDbType, string, any, any, any, any>,
    TRParamName extends TRParamMedian extends QueryParam<any, infer U, any, any, any, any> ? U : never,
    TRParamValue extends TRParamMedian extends QueryParam<any, any, infer TVal, any, any, any> ? TVal : never,
    TRParam extends QueryParam<TDbType, TRParamName, IsAny<TRParamValue> extends true ? LiteralToBase<TValueType> | null : TRParamValue, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never
>(
    this: TComparing,
    leftValue: TLParamValue extends (LiteralToBase<TValueType> | null) ? TLParamMedian : never,
    rightValue: TRParamValue extends (LiteralToBase<TValueType> | null) ? TRParamMedian : never
): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TLParam, TRParam]
>
function between<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TLParamMedian extends QueryParam<TDbType, string, any, any, any, any>,
    TLParamName extends TLParamMedian extends QueryParam<any, infer U, any, any, any, any> ? U : never,
    TLParamValue extends TLParamMedian extends QueryParam<any, any, infer TVal, any, any, any> ? TVal : never,
    TLParam extends QueryParam<TDbType, TLParamName, IsAny<TLParamValue> extends true ? LiteralToBase<TValueType> | null : TLParamValue, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never
>(
    this: TComparing,
    leftValue: TLParamValue extends (LiteralToBase<TValueType> | null) ? TLParamMedian : never,
    rightValue: LiteralToBase<TValueType> | null
): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TLParam, TValueType | null]
>
function between<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TRParamMedian extends QueryParam<TDbType, string, any, any, any, any>,
    TRParamName extends TRParamMedian extends QueryParam<any, infer U, any, any, any, any> ? U : never,
    TRParamValue extends TRParamMedian extends QueryParam<any, any, infer TVal, any, any, any> ? TVal : never,
    TRParam extends QueryParam<TDbType, TRParamName, IsAny<TRParamValue> extends true ? LiteralToBase<TValueType> | null : TRParamValue, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never
>(
    this: TComparing,
    leftValue: LiteralToBase<TValueType> | null,
    rightValue: TRParamValue extends (LiteralToBase<TValueType> | null) ? TRParamMedian : never
): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TValueType | null, TRParam]
>
function between<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TLParamMedian extends QueryParam<TDbType, string, any, any, any, any>,
    TLParamName extends TLParamMedian extends QueryParam<any, infer U, any, any, any, any> ? U : never,
    TLParamValue extends TLParamMedian extends QueryParam<any, any, infer TVal, any, any, any> ? TVal : never,
    TLParam extends QueryParam<TDbType, TLParamName, IsAny<TLParamValue> extends true ? LiteralToBase<TValueType> | null : TLParamValue, any, any, any>,
    TRApplied extends IComparable<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never
>(
    this: TComparing,
    leftValue: TLParamValue extends (LiteralToBase<TValueType> | null) ? TLParamMedian : never,
    rightValue: TRApplied
): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TLParam, TRApplied]
>
function between<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TRParamMedian extends QueryParam<TDbType, string, any, any, any, any>,
    TRParamName extends TRParamMedian extends QueryParam<any, infer U, any, any, any, any> ? U : never,
    TRParamValue extends TRParamMedian extends QueryParam<any, any, infer TVal, any, any, any> ? TVal : never,
    TRParam extends QueryParam<TDbType, TRParamName, IsAny<TRParamValue> extends true ? LiteralToBase<TValueType> | null : TRParamValue, any, any, any>,
    TLApplied extends IComparable<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never
>(
    this: TComparing,
    leftValue: TLApplied,
    rightValue: TRParamValue extends (LiteralToBase<TValueType> | null) ? TRParamMedian : never
): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TLApplied, TRParam]
>


// All same
function between<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never
>(this: TComparing, leftValue: LiteralToBase<TValueType> | null, rightValue: LiteralToBase<TValueType> | null): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TValueType | null, TValueType | null]
>
function between<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TLApplied extends IComparable<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
    TRApplied extends IComparable<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never
>(this: TComparing, leftValue: TLApplied, rightValue: TRApplied): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TLApplied, TRApplied]
>



// Column and value
/**
 * Notes: No infer is required on primitive value arguments. Because it infers literal type from that argument
 * without NoInfer.
 * @param this 
 * @param leftValue 
 * @param rightValue 
 */
function between<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TLApplied extends IComparable<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never
>(this: TComparing, leftValue: TLApplied, rightValue: LiteralToBase<TValueType> | null): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TLApplied, TValueType | null]
>
function between<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TRApplied extends IComparable<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never
>(this: TComparing, leftValue: LiteralToBase<TValueType> | null, rightValue: TRApplied): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TValueType | null, TRApplied]
>


//Implementation
function between<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TLParamMedian extends QueryParam<TDbType, string, any, any, any, any> | undefined,
    TLParamName extends (TLParamMedian extends QueryParam<any, infer U, any, any, any, any> ? U : never) | undefined,
    TLParamValue extends TLParamMedian extends QueryParam<any, any, infer TVal, any, any, any> ? TVal : never,
    TRParamMedian extends QueryParam<TDbType, string, any, any, any, any> | undefined,
    TRParamName extends (TRParamMedian extends QueryParam<any, infer U, any, any, any, any> ? U : never) | undefined,
    TRParamValue extends TRParamMedian extends QueryParam<any, any, infer TVal, any, any, any> ? TVal : never,
    TLApplied extends IComparable<TDbType, any, LiteralToBase<TValueType>, any, any, any, any> | undefined,
    TRApplied extends IComparable<TDbType, any, LiteralToBase<TValueType>, any, any, any, any> | undefined,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never
>
    (
        this: TComparing,
        leftValue: LiteralToBase<TValueType> | null | TLParamMedian | TLApplied,
        rightValue: LiteralToBase<TValueType> | null | TRParamMedian | TRApplied
    ) {

    const dbType = this.dbType;

    if (leftValue instanceof QueryParam) {
        const lParam = new QueryParam<
            TDbType,
            TLParamName extends string ? TLParamName : never,
            IsAny<TLParamValue> extends true ? TValueType | null : TLParamValue
        >(leftValue.dbType, leftValue.name);

        if (rightValue instanceof QueryParam) {
            const rParam = new QueryParam<
                TDbType,
                TRParamName extends string ? TRParamName : never,
                IsAny<TRParamValue> extends true ? TValueType | null : TRParamValue
            >(leftValue.dbType, rightValue.name);

            return new ColumnComparisonOperation(
                dbType,
                comparisonOperations.between,
                this,
                [lParam, rParam]
            )
        }

        if (rightValue === undefined) {
            throw Error('Invalid argument.');
        }

        return new ColumnComparisonOperation(
            dbType,
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
        >(leftValue.dbType, rightValue.name);

        if (leftValue instanceof QueryParam) {
            const lParam = new QueryParam<
                TDbType,
                TLParamName extends string ? TLParamName : never,
                IsAny<TLParamValue> extends true ? TValueType | null : TLParamValue
            >(leftValue.dbType, leftValue.name);

            return new ColumnComparisonOperation(
                dbType,
                comparisonOperations.between,
                this,
                [lParam, rParam]
            );
        }

        if (leftValue === undefined) {
            throw Error('Invalid argument.');
        }

        return new ColumnComparisonOperation(
            dbType,
            comparisonOperations.between,
            this,
            [leftValue, rParam]
        );

    }

    if (rightValue === undefined || leftValue === undefined) {
        throw Error('Invalid argument.');
    }

    return new ColumnComparisonOperation(
        dbType,
        comparisonOperations.between,
        this,
        [leftValue, rightValue]
    );
}

export default between;
