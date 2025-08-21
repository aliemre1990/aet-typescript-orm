import type { DbType, PgDbType } from "../db.js";
import type { PgColumnType, PgTypeToJsType } from "../postgresql/dataTypes.js";
import type { SingleKeyObject } from "../utility/common.js";
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

class ColumnOperation<
    TDbType extends DbType,
    TQueryColumn extends QueryColumn<TDbType, any, any, any>,
    TParams extends [QueryParam<TDbType, any, any>] | undefined,
    TValueType extends PgTypeToJsType<TQueryColumn["column"]["type"]> | undefined,

> {
    constructor(
        public column: TQueryColumn,
        public operation: ComparisonOperation,
        public value?: TParams | TValueType | QueryColumn<TDbType, any, any, any> | [TValueType | QueryColumn<TDbType, any, any, any>]
    ) { }

}
type ExactlyOne<T> = {
    [K in keyof T]: Pick<T, K> & { [P in Exclude<keyof T, K>]?: never }
}[keyof T];


class QueryParam<
    TDbType extends DbType,
    TName extends string,
    TValue extends string | number | boolean | Date | Buffer | object | null
> {
    constructor(
        public name: TName
    ) { }
}


function pgParam<
    TName extends string,
    TColumn extends ColumnType<PgDbType>,
    TQueryColumn extends QueryColumn<DbType, TColumn, any, any>,
    TValue extends PgTypeToJsType<TQueryColumn["column"]["type"]>
>(
    name: TName
) {
    return new QueryParam<PgDbType, TName, TValue>(name);
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

    equals<
        TQueryColumn extends QueryColumn<TDbType, any, any, any>,
        TValueType extends PgTypeToJsType<TColumn["type"]>,
        TParamName extends string,
        TParam extends undefined
    >(value: TValueType | TQueryColumn): ColumnOperation<
        TDbType,
        QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
        TParam,
        TValueType
    >
    equals<
        TQueryColumn extends QueryColumn<TDbType, any, any, any>,
        TValueType extends PgTypeToJsType<TColumn["type"]>,
        TParamName extends string,
        TParam extends QueryParam<TDbType, TParamName, TValueType>
    >(value: TParam
    ): ColumnOperation<
        TDbType,
        QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
        [TParam],
        TValueType
    >
    equals<
        TQueryColumn extends QueryColumn<TDbType, any, any, any>,
        TValueType extends PgTypeToJsType<TColumn["type"]>,
        TParamName extends string,
        TParam extends QueryParam<TDbType, TParamName, TValueType> | undefined
    >
        (value: TValueType | TParam | TQueryColumn) {

        return new ColumnOperation<
            TDbType,
            QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
            TParam extends undefined ? undefined : [TParam],
            TValueType
        >(
            this,
            comparisonOperations.eq.name,
            [value] as TParam extends undefined ? undefined : [TParam]
        )
    }
}

export default QueryColumn;

export {
    pgParam
}