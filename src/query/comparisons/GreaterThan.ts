import type { DbType, PgDbType } from "../../db.js";
import type { JsTypeToPgTypes, PgTypeToJsType } from "../../postgresql/dataTypes.js";
import type Column from "../../table/column.js";
import type { ColumnType, QueryTableSpecsType } from "../../table/types/utils.js";
import type { GetColumnTypeFromDbType } from "../_types/miscellaneous.js";
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
        TParamName extends string,
        TParamMedian extends undefined,
        TParam extends undefined,
        TValueType extends TDbType extends PgDbType ? PgTypeToJsType<TColumn["type"]> : never,
        TQueryColumn extends QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TValueType>, any, any>, any, any>,
    >(value: TValueType | TQueryColumn): ColumnComparisonOperation<
        TDbType,
        QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
        undefined
    >
    gt<
        TParamMedian extends QueryParamMedian<any>,
        TParamName extends TParamMedian extends QueryParamMedian<infer U> ? U : never,
        TParam extends QueryParam<TDbType, TParamName, TValueType>,
        TValueType extends TDbType extends PgDbType ? PgTypeToJsType<TColumn["type"]> : never,
        TQueryColumn extends undefined
    >(value: TParamMedian
    ): ColumnComparisonOperation<
        TDbType,
        QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
        [TParam],
        TQueryColumn
    >
    gt<
        TParamMedian extends QueryParamMedian<any>,
        TParamName extends TParamMedian extends QueryParamMedian<infer U> ? U : never,
        TParam extends QueryParam<TDbType, TParamName, TValueType> | undefined,
        TValueType extends TDbType extends PgDbType ? PgTypeToJsType<TColumn["type"]> : never,
        TQueryColumn extends QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TValueType>, any, any>, any, any> | undefined
    >
        (value: GetColumnTypeFromDbType<TDbType, TColumn> | TParamMedian | TQueryColumn) {

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
                undefined,
                TQueryColumn
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
            value as GetColumnTypeFromDbType<TDbType, TColumn>
        );
    }
}

export default GreaterThan;
