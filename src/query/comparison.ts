import type { DbType } from "../db.js";
import type { PgTypeToJsType } from "../postgresql/dataTypes.js";
import type { QueryParam } from "../table/queryColumn.js";
import type QueryColumn from "../table/queryColumn.js";

const comparisonOperations = {
    eq: { name: 'EQ' },
    ne: { name: 'NE' },
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

type ComparisonOperation = (typeof comparisonOperations)[keyof typeof comparisonOperations]["name"];

class ColumnComparisonOperation<
    TDbType extends DbType,
    TQueryColumn extends QueryColumn<TDbType, any, any, any>,
    TParams extends QueryParam<TDbType, any, any>[] | undefined,
    TValueType extends PgTypeToJsType<TQueryColumn["column"]["type"]> | undefined,

> {
    constructor(
        public column: TQueryColumn,
        public operation: ComparisonOperation,
        public value?: TParams | TValueType | QueryColumn<TDbType, any, any, any> | [TValueType | QueryColumn<TDbType, any, any, any>]
    ) { }

}

export default ColumnComparisonOperation;

export {
    comparisonOperations
}

export type {
    ComparisonOperation
}