import type { DbType, PgDbType } from "../db.js";
import type { JsTypeToPgTypes, PgTypeToJsType } from "../postgresql/dataTypes.js";
import type Column from "../table/column.js";
import type { GetColumnTypeFromDbType } from "./_types/miscellaneous.js";
import type { QueryParam } from "./queryColumn.js";
import type QueryColumn from "./queryColumn.js";

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

type ComparisonOperation = (typeof comparisonOperations)[keyof typeof comparisonOperations]["name"];

class ColumnComparisonOperation<
    TDbType extends DbType,
    TQueryColumn extends QueryColumn<TDbType, any, any, any>,
    TParams extends QueryParam<TDbType, any, any>[] | undefined,
    TAppliedQColumn extends QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TValueType>, any, any>, any, any> | undefined = undefined,
    TValueType = GetColumnTypeFromDbType<TDbType, TQueryColumn extends QueryColumn<TDbType, infer TCol, any, any> ? TCol : never>
> {
    constructor(
        public column: TQueryColumn,
        public operation: ComparisonOperation,
        public value?: TParams | TValueType | TAppliedQColumn | [TValueType | QueryColumn<TDbType, any, any, any>]
    ) { }
}

export default ColumnComparisonOperation;

export {
    comparisonOperations
}

export type {
    ComparisonOperation
}