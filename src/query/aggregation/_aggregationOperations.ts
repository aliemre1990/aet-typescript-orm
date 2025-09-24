import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import between from "../comparisons/between.js";
import eq from "../comparisons/eq.js";
import sqlIn from "../comparisons/in.js";
import type { InferParamsFromFnArgs } from "../_types/inferParamsFromArgs.js";
import type { InferTypeName, InferTypeNamesFromArgs } from "../_types/comparableIdInference.js";


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
    jsonbAgg: { name: 'JSONB_AGG' },

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


type InferIdAggregation<
    TDbType extends DbType,
    TAggregationOperation extends AggregationOperation,
    TArgs extends (

        DbValueTypes | null |
        IComparable<TDbType, any, any, any, any, true, any>
    )[],
    TReturnType extends DbValueTypes | null,
    TAs extends string | undefined = undefined
> =
    `${Lowercase<TAggregationOperation["name"]>}(${InferTypeNamesFromArgs<TArgs>}):${InferTypeName<TReturnType>} as ${TAs extends string ? TAs : "undefined"}`
    ;

class BasicColumnAggregationOperation<
    TDbType extends DbType,
    TAggregationOperation extends AggregationOperation,
    TArgs extends (

        DbValueTypes | null |
        IComparable<TDbType, any, any, any, any, true, any>
    )[],
    TReturnType extends DbValueTypes | null,
    TIsAgg extends boolean = false,
    TAs extends string | undefined = undefined,
    TComparableId extends string = InferIdAggregation<TDbType, TAggregationOperation, TArgs, TReturnType, TAs>
> implements IComparable<TDbType, TComparableId, InferParamsFromFnArgs<TArgs>, NonNullable<TReturnType>, TReturnType, TIsAgg, TAs> {

    icomparableValueDummy?: NonNullable<TReturnType>;
    icomparableFinalValueDummy?: TReturnType;
    icomparableIdDummy?: TComparableId;
    params?: InferParamsFromFnArgs<TArgs>;
    isAgg?: TIsAgg;
    asName?: TAs;

    eq: typeof eq = eq;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;

    as<TAs extends string>(asName: TAs) {
        return new BasicColumnAggregationOperation<TDbType, TAggregationOperation, TArgs, TReturnType, TIsAgg, TAs>(this.dbType, this.args, this.operation, asName);
    }

    constructor(
        public dbType: TDbType,
        public args: TArgs,
        public operation: TAggregationOperation,
        asName?: TAs
    ) {
        this.asName = asName;
    }
}

export default BasicColumnAggregationOperation;

export {
    aggregationOperations
}

export type {
    AggregationOperation
}