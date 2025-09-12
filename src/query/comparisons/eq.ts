import type { DbType } from "../../db.js";
import type Column from "../../table/column.js";
import ColumnComparisonOperation, { comparisonOperations } from "./_comparisonOperations.js";
import { QueryParam } from "../queryColumn.js";
import QueryColumn from "../queryColumn.js";
import type ColumnSQLFunction from "../functions/_functions.js";
import type { InferValueTypeFromComparable, InferValueTypeFromThisType } from "./_types/inferValue.js";
import type { IComparable } from "./_interfaces/IComparable.js";

function eq<
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TParamMedian extends QueryParam<TDbType, string, any>,
    TParamName extends TParamMedian extends QueryParam<any, infer U, any> ? U : never,
    TParam extends QueryParam<TDbType, TParamName, TValueType | null>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any> ? DbType : never,
>(this: TComparing, value: TParamMedian
): ColumnComparisonOperation<
    TDbType,
    TComparing,
    undefined,
    [TParam]
>
function eq<
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TApplied extends IComparable<TDbType, any, TValueType, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any> ? DbType : never,
>(this: TComparing, value: TApplied): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TApplied],
    undefined
>
function eq<
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any> ? DbType : never,
>(this: TComparing, value: TValueType | null): ColumnComparisonOperation<
    TDbType,
    TComparing,
    undefined,
    undefined
>
function eq<
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TParamMedian extends QueryParam<TDbType, string, any> | undefined,
    TParamName extends (TParamMedian extends QueryParam<any, infer U, any> ? U : never) | undefined,
    TApplied extends IComparable<TDbType, any, TValueType, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any> ? DbType : never,
>
    (this: TComparing, value: TValueType | TParamMedian | TApplied | null) {

    if (value instanceof QueryParam) {
        const param = new QueryParam<TDbType, TParamName extends string ? TParamName : never, TValueType | null>(value.name, value.dbType);

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
