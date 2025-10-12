import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, type IComparable } from "../_interfaces/IComparable.js";
import between from "../comparisons/between.js";
import eq from "../comparisons/eq.js";
import sqlIn from "../comparisons/in.js";
import type { InferParamsFromFnArgs } from "../_types/inferParamsFromArgs.js";
import type QueryParam from "../param.js";


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

class BasicColumnAggregationOperation<
    TDbType extends DbType,
    TAggregationOperation extends AggregationOperation,
    TArgs extends (

        DbValueTypes | null |
        IComparable<TDbType, any, any, any, any, any>
    )[],
    TReturnType extends DbValueTypes | null,
    TParams extends QueryParam<TDbType, string, any, any, any>[] | undefined = InferParamsFromFnArgs<TArgs>,
    TAs extends string | undefined = undefined,
    TDefaultFieldKey extends string = `${Lowercase<TAggregationOperation["name"]>}`,
> implements IComparable<TDbType, TParams, NonNullable<TReturnType>, TReturnType, TDefaultFieldKey, TAs> {

    dbType: TDbType;
    args: TArgs;
    operation: TAggregationOperation;

    [IComparableValueDummySymbol]?: NonNullable<TReturnType>;
    [IComparableFinalValueDummySymbol]?: TReturnType;
    params?: TParams;
    asName?: TAs;
    defaultFieldKey: TDefaultFieldKey;

    eq: typeof eq = eq;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;

    as<TAs extends string>(asName: TAs) {
        return new BasicColumnAggregationOperation<TDbType, TAggregationOperation, TArgs, TReturnType, TParams, TAs, TDefaultFieldKey>(this.dbType, this.args, this.operation, asName, this.ownerName);
    }

    ownerName?: string;
    setOwnerName(val: string): BasicColumnAggregationOperation<TDbType, TAggregationOperation, TArgs, TReturnType, TParams, TAs, TDefaultFieldKey> {
        return new BasicColumnAggregationOperation<TDbType, TAggregationOperation, TArgs, TReturnType, TParams, TAs, TDefaultFieldKey>(this.dbType, this.args, this.operation, this.asName, val);
    }

    constructor(
        dbType: TDbType,
        args: TArgs,
        operation: TAggregationOperation,
        asName?: TAs,
        ownerName?: string
    ) {
        this.dbType = dbType;
        this.args = args;
        this.operation = operation;
        this.asName = asName;
        this.ownerName = ownerName;
        this.defaultFieldKey = `${operation.name.toLowerCase()}` as TDefaultFieldKey;

        let tmpParams: QueryParam<TDbType, any, any, any, any>[] = [];

        for (const arg of args) {
            if (
                arg instanceof Object &&
                "params" in arg &&
                arg.params !== undefined &&
                arg.params.length > 0
            ) {
                tmpParams.push(...arg.params);
            }
        }

        if (tmpParams.length > 0) {
            this.params = tmpParams as TParams;
        }
    }
}

export default BasicColumnAggregationOperation;

export {
    aggregationOperations
}

export type {
    AggregationOperation
}