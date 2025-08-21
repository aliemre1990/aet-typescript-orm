import type { DbType, PgDbType } from "../db.js";
import type { PgColumnType, PgTypeToJsType, PgValueTypes } from "../postgresql/dataTypes.js";
import ColumnComparisonOperation, { comparisonOperations } from "../query/comparison.js";
import type { ColumnType, QueryTableSpecsType } from "./types/utils.js";


class QueryParamMedian<TDbType extends DbType, TName extends string> {
    constructor(public name: TName) { }
}

class QueryParam<
    TDbType extends DbType,
    TName extends string,
    TValue extends PgValueTypes
> {
    constructor(public name: TName) { }
}

function pgParam<
    TName extends string
>(
    name: TName
) {
    return new QueryParamMedian<PgDbType, TName>(name);
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
        TParamName extends string,
        TParamMedian extends undefined,
        TParam extends undefined
    >(value: PgTypeToJsType<TColumn["type"]> | TQueryColumn): ColumnComparisonOperation<
        TDbType,
        QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
        undefined
    >
    equals<
        TQueryColumn extends QueryColumn<TDbType, any, any, any>,
        TParamMedian extends QueryParamMedian<TDbType, any>,
        TParamName extends TParamMedian extends QueryParamMedian<TDbType, infer U> ? U : never,
        TParam extends QueryParam<TDbType, TParamName, PgTypeToJsType<TColumn["type"]>>
    >(value: TParamMedian
    ): ColumnComparisonOperation<
        TDbType,
        QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
        [TParam]
    >
    equals<
        TQueryColumn extends QueryColumn<TDbType, any, any, any>,
        TParamMedian extends QueryParamMedian<TDbType, any>,
        TParamName extends TParamMedian extends QueryParamMedian<TDbType, infer U> ? U : never,
        TParam extends QueryParam<TDbType, TParamName, PgTypeToJsType<TColumn["type"]>> | undefined,
    >
        (value: PgTypeToJsType<TColumn["type"]> | TParamMedian | TQueryColumn) {

        if (value instanceof QueryParamMedian) {
            const param = new QueryParam<TDbType, TParamName, PgTypeToJsType<TColumn["type"]>>(value.name);

            return new ColumnComparisonOperation<
                TDbType,
                QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
                TParam extends undefined ? undefined : [TParam]
            >(
                this,
                comparisonOperations.eq.name,
                [param] as TParam extends undefined ? undefined : [TParam]
            )
        } else if (value instanceof QueryColumn) {
            return new ColumnComparisonOperation<
                TDbType,
                QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
                undefined
            >(
                this,
                comparisonOperations.eq.name,
                value as TQueryColumn
            )
        }

        return new ColumnComparisonOperation<
            TDbType,
            QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
            undefined
        >(
            this,
            comparisonOperations.eq.name,
            value as PgTypeToJsType<TColumn["type"]>
        );
    }
}

export default QueryColumn;

export {
    pgParam,
    QueryParam,
    QueryParamMedian
}