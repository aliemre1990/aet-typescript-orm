import { type DbType } from "../db.js";
import type ColumnComparisonOperation from "./comparisons/_comparisonOperations.js";
import type QueryParam from "./param.js";

const logicalOperations = {
    and: { name: 'AND' },
    or: { name: 'OR' }
} as const

type LogicalOperation = (typeof logicalOperations[keyof typeof logicalOperations]);

class ColumnLogicalOperation<
    TDbType extends DbType,
    TComparisons extends (ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>)[],
> {
    dbType: TDbType;
    operator: LogicalOperation;
    comparisons: TComparisons;

    params?: QueryParam<TDbType, any, any, any, any, any>[];

    constructor(
        dbType: TDbType,
        operator: LogicalOperation,
        comparisons: TComparisons
    ) {
        this.dbType = dbType;
        this.operator = operator;
        this.comparisons = comparisons;


        const tmpParams: typeof this.params = [];

        comparisons.forEach(comp => {
            if (
                comp instanceof Object &&
                "params" in comp &&
                comp.params !== undefined &&
                comp.params.length > 0
            ) {
                tmpParams.push(...comp.params);
            }
        })

        if (tmpParams.length > 0) {
            this.params = tmpParams;
        }
    }



}

function generateAndFn<TDbType extends DbType>(
    dbType: TDbType
) {
    return function <
        TComparisons extends (ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>)[]
    >(...ops: TComparisons) {
        return new ColumnLogicalOperation<TDbType, TComparisons>(dbType, logicalOperations.and, ops);
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