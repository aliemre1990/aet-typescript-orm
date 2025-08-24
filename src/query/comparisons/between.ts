import type { DbType, PgDbType } from "../../db.js";
import type { JsTypeToPgTypes, PgTypeToJsType } from "../../postgresql/dataTypes.js";
import type Column from "../../table/column.js";
import type { ColumnType, QueryTableSpecsType } from "../../table/types/utils.js";
import type { GetColumnTypeFromDbType } from "../_types/miscellaneous.js";
import ColumnComparisonOperation, { comparisonOperations } from "../comparison.js";
import { QueryParam, QueryParamMedian } from "../queryColumn.js";
import QueryColumn from "../queryColumn.js";


// All same
function between<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined,
    TValueType extends GetColumnTypeFromDbType<TDbType, TColumn>
>(this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>, leftValue: TValueType, rightValue: TValueType): ColumnComparisonOperation<
    TDbType,
    QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
    undefined,
    undefined
>
function between<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined,
    TValueType extends GetColumnTypeFromDbType<TDbType, TColumn>,
    TLAppliedQColumn extends QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TValueType>, any, any>, any, any>,
    TRAppliedQColumn extends QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TValueType>, any, any>, any, any>,
>(this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>, leftValue: TLAppliedQColumn, rightValue: TRAppliedQColumn): ColumnComparisonOperation<
    TDbType,
    QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
    undefined,
    [TLAppliedQColumn, TRAppliedQColumn]
>
function between<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined,
    TLParamMedian extends QueryParamMedian<any>,
    TLParamName extends TLParamMedian extends QueryParamMedian<infer U> ? U : never,
    TLParam extends QueryParam<TDbType, TLParamName, TValueType>,
    TRParamMedian extends QueryParamMedian<any>,
    TRParamName extends TRParamMedian extends QueryParamMedian<infer U> ? U : never,
    TRParam extends QueryParam<TDbType, TRParamName, TValueType>,
    TValueType extends GetColumnTypeFromDbType<TDbType, TColumn>
>(this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>, leftValue: TLParamMedian, rightValue: TRParamMedian
): ColumnComparisonOperation<
    TDbType,
    QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
    [TLParam, TRParam],
    undefined
>

// Column and value
function between<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined,
    TValueType extends GetColumnTypeFromDbType<TDbType, TColumn>,
    TLAppliedQColumn extends QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TValueType>, any, any>, any, any>,
>(this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>, leftValue: TLAppliedQColumn, rightValue: TValueType): ColumnComparisonOperation<
    TDbType,
    QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
    undefined,
    [TLAppliedQColumn]
>
function between<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined,
    TValueType extends GetColumnTypeFromDbType<TDbType, TColumn>,
    TRAppliedQColumn extends QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TValueType>, any, any>, any, any>,
>(this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>, leftValue: TValueType, rightValue: TRAppliedQColumn): ColumnComparisonOperation<
    TDbType,
    QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
    undefined,
    [TRAppliedQColumn]
>

// Param and value
function between<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined,
    TLParamMedian extends QueryParamMedian<any>,
    TLParamName extends TLParamMedian extends QueryParamMedian<infer U> ? U : never,
    TLParam extends QueryParam<TDbType, TLParamName, TValueType>,
    TValueType extends GetColumnTypeFromDbType<TDbType, TColumn>,
>(this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>, leftValue: TLParamMedian, rightValue: TValueType): ColumnComparisonOperation<
    TDbType,
    QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
    [TLParam],
    undefined
>
function between<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined,
    TRParamMedian extends QueryParamMedian<any>,
    TRParamName extends TRParamMedian extends QueryParamMedian<infer U> ? U : never,
    TRParam extends QueryParam<TDbType, TRParamName, TValueType>,
    TValueType extends GetColumnTypeFromDbType<TDbType, TColumn>
>(this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>, leftValue: TValueType, rightValue: TRParamMedian): ColumnComparisonOperation<
    TDbType,
    QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
    [TRParam],
    undefined
>

// Param and column
function between<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined,
    TLParamMedian extends QueryParamMedian<any>,
    TLParamName extends TLParamMedian extends QueryParamMedian<infer U> ? U : never,
    TLParam extends QueryParam<TDbType, TLParamName, TValueType>,
    TValueType extends GetColumnTypeFromDbType<TDbType, TColumn>,
    TRAppliedQColumn extends QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TValueType>, any, any>, any, any>,
>(this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>, leftValue: TLParamMedian, rightValue: TRAppliedQColumn): ColumnComparisonOperation<
    TDbType,
    QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
    [TLParam],
    [TRAppliedQColumn]
>
function between<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined,
    TRParamMedian extends QueryParamMedian<any>,
    TRParamName extends TRParamMedian extends QueryParamMedian<infer U> ? U : never,
    TRParam extends QueryParam<TDbType, TRParamName, TValueType>,
    TValueType extends GetColumnTypeFromDbType<TDbType, TColumn>,
    TLAppliedQColumn extends QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TValueType>, any, any>, any, any>,
>(this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>, leftValue: TLAppliedQColumn, rightValue: TRParamMedian): ColumnComparisonOperation<
    TDbType,
    QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
    [TRParam],
    [TLAppliedQColumn]
>
//Implementation
function between<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined,
    TLParamMedian extends QueryParamMedian<any> | undefined,
    TLParamName extends (TLParamMedian extends QueryParamMedian<infer U> ? U : never) | undefined,
    TLParam extends TLParamName extends string ? (QueryParam<TDbType, TLParamName, TValueType>) : undefined,
    TRParamMedian extends QueryParamMedian<any> | undefined,
    TRParamName extends (TRParamMedian extends QueryParamMedian<infer U> ? U : never) | undefined,
    TRParam extends TRParamName extends string ? (QueryParam<TDbType, TRParamName, TValueType>) : undefined,
    TValueType extends GetColumnTypeFromDbType<TDbType, TColumn>,
    TLAppliedQColumn extends QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TValueType>, any, any>, any, any> | undefined,
    TRAppliedQColumn extends QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TValueType>, any, any>, any, any> | undefined
>
    (
        this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
        leftValue: TValueType | TLParamMedian | TLAppliedQColumn,
        rightValue: TValueType | TRParamMedian | TLAppliedQColumn
    ) {

    if (leftValue instanceof QueryParamMedian) {
        const lParam = new QueryParam<TDbType, TLParamName extends string ? TLParamName : never, TValueType>(leftValue.name);

        if (rightValue instanceof QueryParamMedian) {
            const rParam = new QueryParam<TDbType, TRParamName extends string ? TRParamName : never, TValueType>(rightValue.name);

            return new ColumnComparisonOperation(
                this,
                comparisonOperations.between.name,
                [lParam, rParam] as TLParam extends undefined ? TRParam extends undefined ? undefined : [TRParam] : TRParam extends undefined ? [TLParam] : [TLParam, TRParam]
            )
        }

        if (rightValue instanceof QueryColumn) {
            return new ColumnComparisonOperation(
                this,
                comparisonOperations.between.name,
                [lParam, rightValue]
            )
        }

        return new ColumnComparisonOperation(
            this,
            comparisonOperations.between.name,
            [lParam, rightValue as TValueType]
        )

    }

    if (leftValue instanceof QueryColumn) {
        if (rightValue instanceof QueryColumn) {
            return new ColumnComparisonOperation(
                this,
                comparisonOperations.eq.name,
                [leftValue, rightValue]
            );
        }

        if (rightValue instanceof QueryParamMedian) {
            const rParam = new QueryParam<TDbType, TRParamName extends string ? TRParamName : never, TValueType>(rightValue.name);

            return new ColumnComparisonOperation(
                this,
                comparisonOperations.eq.name,
                [leftValue, rParam]
            );
        }

        return new ColumnComparisonOperation(
            this,
            comparisonOperations.eq.name,
            [leftValue, rightValue]
        );
    }

    return new ColumnComparisonOperation(
        this,
        comparisonOperations.eq.name,
        [leftValue, rightValue]
    );
}

export default between;
