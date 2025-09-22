import type { DbType } from "../../db.js";
import ColumnComparisonOperation, { comparisonOperations, type InferValueTypeFromComparable } from "./_comparisonOperations.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type { IsAny } from "../../utility/common.js";
import QueryParam from "../param.js";

function eq<
    TComparing extends IComparable<TDbType, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TParamMedian extends QueryParam<TDbType, string, any>,
    TParamName extends TParamMedian extends QueryParam<any, infer U, any> ? U : never,
    TParamValue extends TParamMedian extends QueryParam<any, any, infer TVal> ? TVal : never,
    TParam extends QueryParam<TDbType, TParamName, IsAny<TParamValue> extends true ? TValueType | null : TParamValue>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: TParamMedian
): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TParam]

>
function eq<
    TComparing extends IComparable<TDbType, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TApplied extends IComparable<TDbType, any, TValueType, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: TApplied): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TApplied]
>
function eq<
    TComparing extends IComparable<TDbType, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: TValueType | null): ColumnComparisonOperation<
    TDbType,
    TComparing,
    undefined
>
function eq<
    TComparing extends IComparable<TDbType, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TParamMedian extends QueryParam<TDbType, string, any> | undefined,
    TParamName extends (TParamMedian extends QueryParam<any, infer U, any> ? U : never) | undefined,
    TParamValue extends TParamMedian extends QueryParam<any, any, infer TVal> ? TVal : never,
    TApplied extends IComparable<TDbType, any, TValueType, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any> ? DbType : never,
>
    (this: TComparing, value: TValueType | TParamMedian | TApplied | null) {

    if (value instanceof QueryParam) {
        const param = new QueryParam<
            TDbType,
            TParamName extends string ? TParamName : never,
            IsAny<TParamValue> extends true ? TValueType | null : TParamValue
        >(value.name, value.dbType);

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
