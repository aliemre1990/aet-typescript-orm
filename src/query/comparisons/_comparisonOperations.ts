import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type QueryParam from "../param.js";

const comparisonOperations = {
    eq: { name: 'EQ' },
    neq: { name: 'NEQ' },
    gt: { name: 'GT' },
    gte: { name: 'GTE' },
    lt: { name: 'LT' },
    lte: { name: 'LTE' },
    like: { name: 'LIKE' },
    iLike: { name: 'ILIKE' },
    in: { name: 'IN' },
    notIn: { name: 'NOTIN' },
    isNull: { name: 'ISNULL' },
    isNotNull: { name: 'ISNOTNULL' },
    between: { name: 'BETWEEN' },
    exists: { name: 'EXISTS' },
    notExists: { name: 'NOTEXISTS' }
} as const;

type ComparisonOperation = (typeof comparisonOperations)[keyof typeof comparisonOperations];

type InferValueTypeFromComparable<TDbType extends DbType, T> =
    T extends IComparable<TDbType, any, infer TValueType, any, any, any> ? TValueType : never;

class ColumnComparisonOperation<
    TDbType extends DbType,
    TComparing extends IComparable<TDbType, any, any, any, any, any>,
    TApplied extends IComparable<TDbType, any, any, any, any, any>[] | undefined,
    TValueType extends DbValueTypes = InferValueTypeFromComparable<TDbType, TComparing>
> {

    dbType: TDbType;
    operation: ComparisonOperation;
    comparing: TComparing;
    value?: (TValueType | null | TApplied)[]

    params?: QueryParam<TDbType, any, any, any, any>[];

    constructor(
        dbType: TDbType,
        operation: ComparisonOperation,
        comparing: TComparing,
        value?: (TValueType | null | TApplied)[]
    ) {
        this.dbType = dbType;
        this.operation = operation;
        this.comparing = comparing;
        this.value = value;

        const tmpParams: typeof this.params = [];
        if (comparing.params !== undefined && comparing.params.length > 0) {
            tmpParams.push(...comparing.params);
        }

        if (value !== undefined && value.length > 0) {
            value.forEach(val => {
                if (
                    val instanceof Object &&
                    "params" in val &&
                    val.params !== undefined &&
                    Array.isArray(val.params) &&
                    val.params.length > 0
                ) {
                    tmpParams.push(...val.params);
                }
            })
        }

        if (tmpParams.length > 0) {
            this.params = tmpParams;
        }

    }
}

export default ColumnComparisonOperation;

export {
    comparisonOperations
}

export type {
    ComparisonOperation,
    InferValueTypeFromComparable
}