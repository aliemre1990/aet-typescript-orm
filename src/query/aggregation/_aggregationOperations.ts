import type { DbType } from "../../db.js";
import type QueryColumn from "../queryColumn.js";
import type AggregatedColumn from "./_aggregatedColumn.js";


const aggregationOperations = {
    // Basic aggregations
    count: { name: 'COUNT' },
    countDistinct: { name: 'COUNT_DISTINCT' },
    sum: { name: 'SUM' },
    avg: { name: 'AVG' },
    min: { name: 'MIN' },
    max: { name: 'MAX' },

    // String aggregations
    stringAgg: { name: 'STRING_AGG' },

    // Array aggregations (PostgreSQL)
    arrayAgg: { name: 'ARRAY_AGG' },

    // JSON aggregations (PostgreSQL/MySQL)
    jsonAgg: { name: 'JSON_AGG' },
    jsonObjectAgg: { name: 'JSON_OBJECT_AGG' },

    // Boolean aggregations
    boolAnd: { name: 'BOOL_AND' },
    boolOr: { name: 'BOOL_OR' },
    every: { name: 'EVERY' }, // PostgreSQL alias for BOOL_AND

    // Window function related (often used with aggregations)
    first: { name: 'FIRST_VALUE' },
    last: { name: 'LAST_VALUE' }
} as const;

type AggregationOperation = (typeof aggregationOperations)[keyof typeof aggregationOperations];

class BasicColumnAggregationOperation<
    TDbType extends DbType,
    TAggColumn extends AggregatedColumn<TDbType, any>,
    TAppliedType extends any,
    TResultType extends any
> {
    constructor(
        public column: TAggColumn,
        public operation: AggregationOperation
    ) { }
}

export default BasicColumnAggregationOperation;

export {
    aggregationOperations
}

export type {
    AggregationOperation
}