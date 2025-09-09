import type { DbType } from "../../db.js";
import type { GetColumnValueTypes } from "../../table/types/utils.js";
import type ColumnSQLFunction from "../functions/_functions.js";
import type { QueryParam } from "../queryColumn.js";
import type QueryColumn from "../queryColumn.js";
import type { IComparable } from "./_interfaces/IComparable.js";
import type { InferValueTypeFromComparable, InferValueTypeFromThisType } from "./_types/inferValue.js";

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

class ColumnComparisonOperation<
    TDbType extends DbType,
    TComparing extends IComparable<TDbType, any, any, any, any>,
    TApplied extends IComparable<TDbType, any, TValueType, any, any>[] | undefined,
    TParams extends QueryParam<TDbType, any, any>[] | undefined,
    TValueType extends GetColumnValueTypes<TDbType> = InferValueTypeFromComparable<TDbType, TComparing>
> {
    constructor(
        public operation: ComparisonOperation,
        public comparing: TComparing,
        public value?:
            (
                TValueType |
                (TParams extends QueryParam<TDbType, any, any>[] ? TParams[number] : never) |
                TApplied
            )[]
    ) { }
}

export default ColumnComparisonOperation;

export {
    comparisonOperations
}

export type {
    ComparisonOperation
}