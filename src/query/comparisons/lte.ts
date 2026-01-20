import type { DbType } from "../../db.js";
import ColumnComparisonOperation, { comparisonOperations, type InferValueTypeFromComparable } from "./_comparisonOperations.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type { IsAny, LiteralToBase } from "../../utility/common.js";
import QueryParam from "../param.js";

function lte<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TParamMedian extends QueryParam<TDbType, string, any, any, any, any>,
    TParamName extends TParamMedian extends QueryParam<any, infer U, any, any, any, any> ? U : never,
    TParamValue extends TParamMedian extends QueryParam<any, any, infer TVal, any, any, any> ? TVal : never,
    TParam extends QueryParam<TDbType, TParamName, IsAny<TParamValue> extends true ? LiteralToBase<TValueType> | null : TParamValue, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: TParamValue extends (LiteralToBase<TValueType> | null) ? TParamMedian : never
): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TParam]

>
function lte<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TApplied extends IComparable<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: TApplied): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TApplied]
>
function lte<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: LiteralToBase<TValueType> | null): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TValueType | null]
>
function lte<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TParamMedian extends QueryParam<TDbType, string, any, any, any, any> | undefined,
    TParamName extends (TParamMedian extends QueryParam<any, infer U, any, any, any, any> ? U : never) | undefined,
    TParamValue extends TParamMedian extends QueryParam<any, any, infer TVal, any, any, any> ? TVal : never,
    TApplied extends IComparable<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never,
>
    (this: TComparing, value: LiteralToBase<TValueType> | TParamMedian | TApplied | null) {

    const dbType = this.dbType;

    if (value instanceof QueryParam) {
        const param = new QueryParam<
            TDbType,
            TParamName extends string ? TParamName : never,
            IsAny<TParamValue> extends true ? TValueType | null : TParamValue
        >(value.dbType, value.name);

        return new ColumnComparisonOperation(
            dbType,
            comparisonOperations.lte,
            this,
            [param]
        )
    }

    if (value === undefined) {
        throw Error('Invalid argument.');
    }

    return new ColumnComparisonOperation(
        dbType,
        comparisonOperations.lte,
        this,
        [value]
    );
}

export default lte;
