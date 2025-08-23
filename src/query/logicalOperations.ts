import type { DbType, PgDbType } from "../db.js";
import type ColumnComparisonOperation from "./comparison.js";

const logicalOperations = {
    and: { name: 'AND' },
    or: { name: 'OR' }
} as const

type LogicalOperation = (typeof logicalOperations[keyof typeof logicalOperations])["name"];


class ColumnLogicalOperation<
    TDbType extends DbType,
    TComparisons extends (ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>)[],
> {
    constructor(public operator: LogicalOperation, public comparisons: TComparisons) { }
}


function and<
    TComparisons extends (ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>)[],
    TDbType extends DbType = TComparisons extends (ColumnComparisonOperation<infer TDbType1, any, any, any> | ColumnLogicalOperation<infer TDbType2, any>)[] ? TDbType1 & TDbType2 : never
>(...ops: TComparisons) {
    return new ColumnLogicalOperation<TDbType, TComparisons>(logicalOperations.and.name, ops);
}

function or<
    TComparisons extends (ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>)[],
    TDbType extends DbType = TComparisons extends (ColumnComparisonOperation<infer TDbType1, any, any, any> | ColumnLogicalOperation<infer TDbType2, any>)[] ? TDbType1 & TDbType2 : never
>(...ops: TComparisons) {
    return new ColumnLogicalOperation<TDbType, TComparisons>(logicalOperations.or.name, ops);
}

export default ColumnLogicalOperation;

export {
    logicalOperations,
    and,
    or
}

export type {
    LogicalOperation
}