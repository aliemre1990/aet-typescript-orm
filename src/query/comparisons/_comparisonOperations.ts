import type { DbType, PgDbType } from "../../db.js";
import type { JsTypeToPgTypes, PgTypeToJsType } from "../../postgresql/dataTypes.js";
import type Column from "../../table/column.js";
import type { GetColumnTypeFromDbType } from "../_types/miscellaneous.js";
import type ColumnSQLFunction from "../functions/_functions.js";
import type { QueryParam } from "../queryColumn.js";
import type QueryColumn from "../queryColumn.js";

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
    TComparing extends QueryColumn<TDbType, any, any, any> | ColumnSQLFunction<TDbType, any, any>,
    TParams extends QueryParam<TDbType, any, any>[] | undefined,
    TAppliedQColumns extends QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TValueType>, any, any>, any, any>[] | undefined,
    TAppliedQSQLFunctions extends ColumnSQLFunction<TDbType, any, any>[] | undefined,
    TValueType = GetColumnTypeFromDbType<TDbType, TComparing extends QueryColumn<TDbType, infer TCol, any, any> ? TCol : never>
> {
    constructor(
        public operation: ComparisonOperation,
        public comparing: TComparing,
        public value?:
            (
                TValueType |
                (TAppliedQColumns extends QueryColumn<TDbType, any, any, any>[] ? TAppliedQColumns[number] : never) |
                (TAppliedQSQLFunctions extends ColumnSQLFunction<TDbType, any, any>[] ? TAppliedQSQLFunctions[number] : never) |
                (TParams extends QueryParam<TDbType, any, any>[] ? TParams[number] : never)
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