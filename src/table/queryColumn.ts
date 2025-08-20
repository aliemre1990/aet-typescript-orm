import type { DbType } from "../db.js";
import type { ColumnType, QueryTableSpecsType } from "./types/utils.js";

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



class ColumnOperation<TDbType extends DbType> {
    constructor(
        public column: QueryColumn<TDbType, any, any, any>,
        public operation: ComparisonOperation,
        public value?: [string | QueryColumn<TDbType, any, any, any>] | string | QueryColumn<TDbType, any, any, any>
    ) { }

}

class QueryColumn<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined = undefined
> {

    qTableSpecs?: TQTableSpecs;

    constructor(public column: TColumn, public asName?: TAsName) { }

    as<TAsName extends string>(val: TAsName) {
        return new QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>(this.column, val);
    }

    setQTableSpecs(val: TQTableSpecs) {
        this.qTableSpecs = val;
    }

    equals(value: string | QueryColumn<TDbType, any, any, any>) {
        return new ColumnOperation<TDbType>(this, comparisonOperations.eq.name, value)
    }
}

export default QueryColumn;