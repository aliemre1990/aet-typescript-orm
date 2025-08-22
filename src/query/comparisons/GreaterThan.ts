import type { DbType, PgDbType } from "../../db.js";
import type { PgTypeToJsType } from "../../postgresql/dataTypes.js";
import type { ColumnType, QueryTableSpecsType } from "../../table/types/utils.js";
import ColumnComparisonOperation, { comparisonOperations } from "../comparison.js";
import { QueryParam, QueryParamMedian } from "../queryColumn.js";
import QueryColumn from "../queryColumn.js";

class GreaterThan<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined = undefined
> {

    constructor(public qColumn: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>) { }

    gt<
        TQueryColumn extends QueryColumn<TDbType, any, any, any>,
        TParamName extends string,
        TParamMedian extends undefined,
        TParam extends undefined,
        TValueType extends TDbType extends PgDbType ? PgTypeToJsType<TColumn["type"]> : never
    >(value: TValueType | TQueryColumn): ColumnComparisonOperation<
        TDbType,
        QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
        undefined
    >
    gt<
        TQueryColumn extends QueryColumn<TDbType, any, any, any>,
        TParamMedian extends QueryParamMedian<any>,
        TParamName extends TParamMedian extends QueryParamMedian<infer U> ? U : never,
        TParam extends QueryParam<TDbType, TParamName, TValueType>,
        TValueType extends TDbType extends PgDbType ? PgTypeToJsType<TColumn["type"]> : never
    >(value: TParamMedian
    ): ColumnComparisonOperation<
        TDbType,
        QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
        [TParam]
    >
    gt<
        TQueryColumn extends QueryColumn<TDbType, any, any, any>,
        TParamMedian extends QueryParamMedian<any>,
        TParamName extends TParamMedian extends QueryParamMedian<infer U> ? U : never,
        TParam extends QueryParam<TDbType, TParamName, TValueType> | undefined,
        TValueType extends TDbType extends PgDbType ? PgTypeToJsType<TColumn["type"]> : never
    >
        (value: PgTypeToJsType<TColumn["type"]> | TParamMedian | TQueryColumn) {

        if (value instanceof QueryParamMedian) {
            const param = new QueryParam<TDbType, TParamName, TValueType>(value.name);

            return new ColumnComparisonOperation<
                TDbType,
                QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
                TParam extends undefined ? undefined : [TParam]
            >(
                this.qColumn,
                comparisonOperations.gt.name,
                [param] as TParam extends undefined ? undefined : [TParam]
            )
        } else if (value instanceof QueryColumn) {
            return new ColumnComparisonOperation<
                TDbType,
                QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
                undefined
            >(
                this.qColumn,
                comparisonOperations.gt.name,
                value as TQueryColumn
            )
        }

        return new ColumnComparisonOperation<
            TDbType,
            QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
            undefined
        >(
            this.qColumn,
            comparisonOperations.gt.name,
            value as PgTypeToJsType<TColumn["type"]>
        );
    }
}

export default GreaterThan;
