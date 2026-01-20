import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import { queryBuilderContextFactory, type IComparable, type QueryBuilderContext } from "../_interfaces/IComparable.js";
import type { InferParamsFromComparables } from "../_types/paramAccumulationComparison.js";
import type QueryParam from "../param.js";
import QueryBuilder from "../queryBuilder.js";
import { convertArgsToQueryString } from "../uitlity/common.js";

const comparisonOperations = {
    eq: { name: 'EQ', symbol: "=" },
    notEq: { name: 'NOT_EQ', symbol: "!=" },
    gt: { name: 'GT', symbol: ">" },
    gte: { name: 'GTE', symbol: ">=" },
    lt: { name: 'LT', symbol: "<" },
    lte: { name: 'LTE', symbol: "<=" },
    like: { name: 'LIKE', symbol: "LIKE" },
    iLike: { name: 'ILIKE', symbol: "ILIKE" },
    in: { name: 'IN', symbol: "IN" },
    notIn: { name: 'NOT_IN', symbol: "NOT IN" },
    isNull: { name: 'IS_NULL', symbol: "IS NULL" },
    isNotNull: { name: 'IS_NOT_NULL', symbol: "IS NOT NULL" },
    between: { name: 'BETWEEN', symbol: "BETWEEN" },
    notBetween: { name: 'NOT_BETWEEN', symbol: "NOT BETWEEN" },
    exists: { name: 'EXISTS', symbol: "EXISTS" },
    notExists: { name: 'NOT_EXISTS', symbol: "NOT EXISTS" }
} as const;

type ComparisonOperation = (typeof comparisonOperations)[keyof typeof comparisonOperations];

type InferValueTypeFromComparable<TDbType extends DbType, T> =
    T extends IComparable<TDbType, any, infer TValueType, any, any, any, any> ? TValueType : never;

class ColumnComparisonOperation<
    TDbType extends DbType,
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TApplied extends (TValueType | null | IComparable<TDbType, any, any, any, any, any, any>)[] | undefined,
    TValueType extends DbValueTypes = InferValueTypeFromComparable<TDbType, TComparing>
> {

    dbType: TDbType;
    operation: ComparisonOperation;
    comparing: TComparing;
    value?: TApplied

    params?: QueryParam<TDbType, any, any, any, any, any>[];

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        if (this.value === undefined) {
            throw Error('No applied value provided for comparison operation.');
        }

        let comparingStr = this.comparing.buildSQL(context).query;
        if (this.comparing instanceof QueryBuilder) {
            comparingStr = `(${comparingStr})`;
        }

        const appliedStrArr = convertArgsToQueryString(this.value, context);

        let queryRes;
        if ([comparisonOperations.in, comparisonOperations.notIn].some(op => op === this.operation)) {
            queryRes = `${comparingStr} ${this.operation.symbol} (${appliedStrArr.join(', ')})`;
        } else if ([comparisonOperations.between, comparisonOperations.notBetween].some(op => op === this.operation)) {
            if (appliedStrArr.length !== 2) {
                throw Error(`Invalid argument count for 'between' comparison.`);
            }

            queryRes = `${comparingStr} ${this.operation.symbol} ${this.value[0] instanceof QueryBuilder ? `(${appliedStrArr[0]})` : appliedStrArr[0]} AND ${this.value[1] instanceof QueryBuilder ? `(${appliedStrArr[1]})` : appliedStrArr[1]}`;
        } else {
            queryRes = `${comparingStr}${this.operation.symbol}${this.value[0] instanceof QueryBuilder ? `(${appliedStrArr[0]})` : appliedStrArr[0]}`;
        }

        return { query: queryRes, params: [...(context?.params || [])] };
    }

    constructor(
        dbType: TDbType,
        operation: ComparisonOperation,
        comparing: TComparing,
        value?: TApplied
    ) {
        this.dbType = dbType;
        this.operation = operation;
        this.comparing = comparing;
        this.value = value;

        const tmpParams: QueryParam<TDbType, any, any, any, any, any>[] = [];
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