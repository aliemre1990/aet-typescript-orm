import type { DbType, PgDbType } from "../../db.js";
import type { JsTypeToPgTypes, PgTypeToJsType } from "../../postgresql/dataTypes.js";
import type Column from "../../table/column.js";
import type { ColumnType, QueryTableSpecsType } from "../../table/types/utils.js";
import type { GetColumnTypeFromDbType } from "../_types/miscellaneous.js";
import ColumnComparisonOperation, { comparisonOperations } from "../comparison.js";
import { QueryParam, QueryParamMedian } from "../queryColumn.js";
import QueryColumn from "../queryColumn.js";


function gte<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined,
    TValueType extends GetColumnTypeFromDbType<TDbType, TColumn>,
>(this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>, value: TValueType): ColumnComparisonOperation<
    TDbType,
    QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
    undefined,
    undefined
>
function gte<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined,
    TValueType extends GetColumnTypeFromDbType<TDbType, TColumn>,
    TAppliedQColumn extends QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TValueType>, any, any>, any, any>,
>(this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>, value: TAppliedQColumn): ColumnComparisonOperation<
    TDbType,
    QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
    undefined,
    [TAppliedQColumn]
>
function gte<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined,
    TParamMedian extends QueryParamMedian<any>,
    TParamName extends TParamMedian extends QueryParamMedian<infer U> ? U : never,
    TParam extends QueryParam<TDbType, TParamName, TValueType>,
    TValueType extends GetColumnTypeFromDbType<TDbType, TColumn>
>(this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>, value: TParamMedian
): ColumnComparisonOperation<
    TDbType,
    QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
    [TParam],
    undefined
>
function gte<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined,
    TParamMedian extends QueryParamMedian<any> | undefined,
    TParamName extends (TParamMedian extends QueryParamMedian<infer U> ? U : never) | undefined,
    TParam extends TParamName extends string ? (QueryParam<TDbType, TParamName, TValueType>) : undefined,
    TValueType extends GetColumnTypeFromDbType<TDbType, TColumn>,
    TAppliedQColumn extends QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TValueType>, any, any>, any, any> | undefined
>
    (this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>, value: TValueType | TParamMedian | TAppliedQColumn) {

    if (value instanceof QueryParamMedian) {
        const param = new QueryParam<TDbType, TParamName extends string ? TParamName : never, TValueType>(value.name);

        return new ColumnComparisonOperation<
            TDbType,
            QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
            TParam extends undefined ? undefined : [TParam]
        >(
            this,
            comparisonOperations.gte.name,
            [param] as TParam extends undefined ? undefined : [TParam]
        )
    } else if (value instanceof QueryColumn) {
        return new ColumnComparisonOperation<
            TDbType,
            QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
            undefined,
            TAppliedQColumn extends undefined ? undefined : [TAppliedQColumn]
        >(
            this,
            comparisonOperations.gte.name,
            [value] as TAppliedQColumn extends undefined ? undefined : [TAppliedQColumn]
        )
    }

    return new ColumnComparisonOperation<
        TDbType,
        QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
        undefined
    >(
        this,
        comparisonOperations.gte.name,
        value as TValueType
    );
}

export default gte;
