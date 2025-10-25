import type { DbType, PgDbType } from "../../db.js";
import type { GetArrayEquivalentPgValueType } from "../../table/columnTypes.js";
import { isNullOrUndefined } from "../../utility/guards.js";
import ColumnComparisonOperation, { comparisonOperations, type InferValueTypeFromComparable } from "./_comparisonOperations.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type { IsAny, NullableArray } from "../../utility/common.js";
import QueryParam from "../param.js";
import type QueryBuilder from "../queryBuilder.js";
import type { DbValueTypes } from "../../table/column.js";

// Helper type to extract only QueryColumns from the mixed tuple
type ExtractComparables<T extends readonly unknown[]> =
    T extends readonly [infer First, ...infer Rest] ?
    First extends IComparable<any, any, any, any, any, any> ?
    [First, ...ExtractComparables<Rest>] :
    ExtractComparables<Rest> :
    [];

type MapParamsToTypeRecursively<
    TValueType extends DbValueTypes,
    T extends readonly (TValueType | IComparable<any, any, TValueType, any, any, any>)[]
> =
    T extends readonly [infer First, ...infer Rest] ?
    First extends QueryParam<infer DbType, infer Name, infer ValueType, infer As, infer DefaultFieldKey> ?
    IsAny<ValueType> extends true ?
    Rest extends readonly [any, ...any[]] ?
    [QueryParam<DbType, Name, TValueType | null, As, DefaultFieldKey>, ...MapParamsToTypeRecursively<TValueType, Rest>] :
    [QueryParam<DbType, Name, TValueType | null, As, DefaultFieldKey>] :
    Rest extends readonly [any, ...any[]] ?
    [First, ...MapParamsToTypeRecursively<TValueType, Rest>] :
    [First] :
    Rest extends readonly [any, ...any[]] ?
    [First, ...MapParamsToTypeRecursively<TValueType, Rest>] :
    [First] :
    []
    ;


function sqlIn<
    TComparing extends IComparable<TDbType, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TQb extends QueryBuilder<TDbType, any, any, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any> ? DbType : never
>(
    this: TComparing,
    val: TQb
): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TQb]
>
function sqlIn<
    TComparing extends IComparable<TDbType, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    const TValues extends readonly (TValueType | IComparable<TDbType, any, TValueType, any, any, any>)[],
    const TFinalValues extends readonly (TValueType | IComparable<TDbType, any, TValueType, any, any, any>)[] = MapParamsToTypeRecursively<TValueType, TValues>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any> ? DbType : never
>(
    this: TComparing,
    val: TValues
): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [...TFinalValues] // Helper type to extract only the columns as tuple
>


function sqlIn<
    TComparing extends IComparable<TDbType, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TQb extends QueryBuilder<TDbType, any, any, any, any, any, any>,
    TValues extends readonly (TValueType | IComparable<TDbType, any, TValueType, any, any, any>)[],
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any> ? DbType : never
>
    (
        this: TComparing,
        val: TQb | TValues
    ) {

    const dbType = this.dbType;

    if (val instanceof Array) {
        return new ColumnComparisonOperation(
            dbType,
            comparisonOperations.in,
            this,
            [...val]
        )
    }

    // value is querybuilder
    return new ColumnComparisonOperation(
        dbType,
        comparisonOperations.in,
        this,
        [val]
    );
}

export default sqlIn;
