import type { DbType, PgDbType } from "../../db.js";
import type { GetArrayEquivalentPgValueType } from "../../table/columnTypes.js";
import { isNullOrUndefined } from "../../utility/guards.js";
import ColumnComparisonOperation, { comparisonOperations, type InferValueTypeFromComparable } from "./_comparisonOperations.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type { IsAny, NullableArray } from "../../utility/common.js";
import QueryParam from "../param.js";
import QueryBuilder from "../queryBuilder.js";
import type { DbValueTypes } from "../../table/column.js";
import type { MapParamsToTypeRecursively } from "./in.js";

function sqlNotIn<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TQb extends QueryBuilder<TDbType, any, any, any, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never
>(
    this: TComparing,
    val: TQb
): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TQb]
>
function sqlNotIn<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    const TValues extends readonly (TValueType | IComparable<TDbType, any, TValueType, any, any, any, any>)[],
    const TFinalValues extends readonly (TValueType | IComparable<TDbType, any, TValueType, any, any, any, any>)[] = MapParamsToTypeRecursively<TValueType, TValues>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never
>(
    this: TComparing,
    ...val: TValues
): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [...TFinalValues] // Helper type to extract only the columns as tuple
>


function sqlNotIn<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TQb extends QueryBuilder<TDbType, any, any, any, any, any, any, any>,
    TValues extends TValueType | IComparable<TDbType, any, TValueType, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never
>
    (
        this: TComparing,
        ...val: (TQb | TValues)[]
    ) {

    const dbType = this.dbType;

    if (val[0] instanceof QueryBuilder) {
        // value is querybuilder
        return new ColumnComparisonOperation(
            dbType,
            comparisonOperations.notIn,
            this,
            [val[0]]
        );
    }

    return new ColumnComparisonOperation(
        dbType,
        comparisonOperations.notIn,
        this,
        [...val]
    )

}

export default sqlNotIn;
