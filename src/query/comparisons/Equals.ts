import type { DbType, PgDbType } from "../../db.js";
import type { JsTypeToPgTypes, PgTypeToJsType } from "../../postgresql/dataTypes.js";
import type Column from "../../table/column.js";
import type { ColumnType, QueryTableSpecsType } from "../../table/types/utils.js";
import ColumnComparisonOperation, { comparisonOperations } from "../comparison.js";
import { QueryParam, QueryParamMedian } from "../queryColumn.js";
import QueryColumn from "../queryColumn.js";

class Equals<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined = undefined
> {

    constructor(public qColumn: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>) { }

    eq<
        TQueryColumn extends QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TValueType>, any, any>, any, any>,
        TParamName extends string,
        TParamMedian extends undefined,
        TParam extends undefined,
        TValueType extends TDbType extends PgDbType ? PgTypeToJsType<TColumn["type"]> : never
    >(value: TValueType | TQueryColumn): ColumnComparisonOperation<
        TDbType,
        QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
        undefined
    >
    eq<
        TQueryColumn extends QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TValueType>, any, any>, any, any>,
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
    eq<
        TQueryColumn extends QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TValueType>, any, any>, any, any>,
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
                comparisonOperations.eq.name,
                [param] as TParam extends undefined ? undefined : [TParam]
            )
        } else if (value instanceof QueryColumn) {
            return new ColumnComparisonOperation<
                TDbType,
                QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
                undefined
            >(
                this.qColumn,
                comparisonOperations.eq.name,
                value as TQueryColumn
            )
        }

        return new ColumnComparisonOperation<
            TDbType,
            QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
            undefined
        >(
            this.qColumn,
            comparisonOperations.eq.name,
            value as PgTypeToJsType<TColumn["type"]>
        );
    }
}

export default Equals;
