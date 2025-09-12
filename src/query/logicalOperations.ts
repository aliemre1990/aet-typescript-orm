import { type DbType } from "../db.js";
import type ColumnComparisonOperation from "./comparisons/_comparisonOperations.js";

const logicalOperations = {
    and: { name: 'AND' },
    or: { name: 'OR' }
} as const

type LogicalOperation = (typeof logicalOperations[keyof typeof logicalOperations]);



class ColumnLogicalOperation<
    TDbType extends DbType,
    TComparisons extends (ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>)[],


> {
    constructor(public operator: LogicalOperation, public comparisons: TComparisons, public dbType: TDbType) { }

}

function generateAndFn<TDbType extends DbType>(
    dbType: TDbType
) {
    return function <
        TComparisons extends (ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>)[]
    >(...ops: TComparisons) {
        return new ColumnLogicalOperation<TDbType, TComparisons>(logicalOperations.and, ops, dbType);
    }
}


export default ColumnLogicalOperation;

export {
    logicalOperations,
    generateAndFn
}

export type {
    LogicalOperation
}