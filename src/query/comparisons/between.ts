import type { DbType, PgDbType } from "../../db.js";
import type { JsTypeToPgTypes, PgTypeToJsType } from "../../postgresql/dataTypes.js";
import type Column from "../../table/column.js";
import type { ColumnType, QueryTableSpecsType } from "../../table/types/utils.js";
import type { GetColumnTypeFromDbType, GetColumnValueType } from "../_types/miscellaneous.js";
import ColumnComparisonOperation, { comparisonOperations } from "./_comparisonOperations.js";
import { QueryParam, QueryParamMedian } from "../queryColumn.js";
import QueryColumn from "../queryColumn.js";
import type ColumnSQLFunction from "../functions/_functions.js";
import type { InferValueTypeFromThisType } from "./_types/inferValueTypeFromThisType.js";
import type { IComparable } from "./_interfaces/IComparable.js";


// All same
function between<
    TDbType extends DbType,
    TComparing extends QueryColumn<TDbType, any, any, any> | ColumnSQLFunction<TDbType, any, any, any>,
    TValueType extends InferValueTypeFromThisType<TDbType, TComparing>,
>(this: TComparing, leftValue: TValueType, rightValue: TValueType): ColumnComparisonOperation<
    TDbType,
    TComparing,
    undefined,
    undefined
>
function between<
    TDbType extends DbType,
    TComparing extends QueryColumn<TDbType, any, any, any> | ColumnSQLFunction<TDbType, any, any, any>,
    TValueType extends InferValueTypeFromThisType<TDbType, TComparing>,
    TLApplied extends IComparable<TDbType, any, TValueType>,
    TRApplied extends IComparable<TDbType, any, TValueType>
>(this: TComparing, leftValue: TLApplied, rightValue: TRApplied): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TLApplied, TRApplied],
    undefined
>
function between<
    TDbType extends DbType,
    TComparing extends QueryColumn<TDbType, any, any, any> | ColumnSQLFunction<TDbType, any, any, any>,
    TValueType extends InferValueTypeFromThisType<TDbType, TComparing>,
    TLParamMedian extends QueryParamMedian<any>,
    TLParamName extends TLParamMedian extends QueryParamMedian<infer U> ? U : never,
    TLParam extends QueryParam<TDbType, TLParamName, TValueType | null>,
    TRParamMedian extends QueryParamMedian<any>,
    TRParamName extends TRParamMedian extends QueryParamMedian<infer U> ? U : never,
    TRParam extends QueryParam<TDbType, TRParamName, TValueType | null>
>(this: TComparing, leftValue: TLParamMedian, rightValue: TRParamMedian
): ColumnComparisonOperation<
    TDbType,
    TComparing,
    undefined,
    [TLParam, TRParam]
>



// Column and value
function between<
    TDbType extends DbType,
    TComparing extends QueryColumn<TDbType, any, any, any> | ColumnSQLFunction<TDbType, any, any, any>,
    TValueType extends InferValueTypeFromThisType<TDbType, TComparing>,
    TLApplied extends IComparable<TDbType, any, TValueType>
>(this: TComparing, leftValue: TLApplied, rightValue: TValueType | null): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TLApplied],
    undefined
>

function between<
    TDbType extends DbType,
    TComparing extends QueryColumn<TDbType, any, any, any> | ColumnSQLFunction<TDbType, any, any, any>,
    TValueType extends InferValueTypeFromThisType<TDbType, TComparing>,
    TRApplied extends IComparable<TDbType, any, TValueType>
>(this: TComparing, leftValue: TValueType | null, rightValue: TRApplied): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TRApplied],
    undefined
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
    TValueType extends GetColumnValueType<TDbType, TColumn>
>(this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>, leftValue: TLParamMedian, rightValue: TValueType): ColumnComparisonOperation<
    TDbType,
    QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
    undefined,
    [TLParam]
>
function between<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined,
    TRParamMedian extends QueryParamMedian<any>,
    TRParamName extends TRParamMedian extends QueryParamMedian<infer U> ? U : never,
    TRParam extends QueryParam<TDbType, TRParamName, TValueType>,
    TValueType extends GetColumnValueType<TDbType, TColumn>
>(this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>, leftValue: TValueType, rightValue: TRParamMedian): ColumnComparisonOperation<
    TDbType,
    QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
    undefined,
    [TRParam]
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
    TValueType extends GetColumnValueType<TDbType, TColumn>,
    TRApplied extends IComparable<TDbType, any, TValueType>
>(this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>, leftValue: TLParamMedian, rightValue: TRApplied): ColumnComparisonOperation<
    TDbType,
    QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
    [TRApplied],
    [TLParam]
>
function between<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined,
    TRParamMedian extends QueryParamMedian<any>,
    TRParamName extends TRParamMedian extends QueryParamMedian<infer U> ? U : never,
    TRParam extends QueryParam<TDbType, TRParamName, TValueType>,
    TValueType extends GetColumnValueType<TDbType, TColumn>,
    TLApplied extends IComparable<TDbType, any, TValueType>
>(this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>, leftValue: TLApplied, rightValue: TRParamMedian): ColumnComparisonOperation<
    TDbType,
    QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
    [TLApplied],
    [TRParam]
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
    TValueType extends GetColumnValueType<TDbType, TColumn>,
    TLAppliedQColumn extends QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TDbType, TValueType>, any, any, any>, any, any> | undefined,
    TRAppliedQColumn extends QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TDbType, TValueType>, any, any, any>, any, any> | undefined
>
    (
        this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
        leftValue: TValueType | TLParamMedian | TLAppliedQColumn,
        rightValue: TValueType | TRParamMedian | TRAppliedQColumn
    ) {

    if (leftValue instanceof QueryParamMedian) {
        const lParam = new QueryParam<TDbType, TLParamName extends string ? TLParamName : never, TValueType>(leftValue.name);

        if (rightValue instanceof QueryParamMedian) {
            const rParam = new QueryParam<TDbType, TRParamName extends string ? TRParamName : never, TValueType>(rightValue.name);

            return new ColumnComparisonOperation(
                comparisonOperations.between,
                this,
                [lParam, rParam]
            )
        }

        return new ColumnComparisonOperation(
            comparisonOperations.between,
            this,
            [lParam, rightValue]
        )

    }

    if (rightValue instanceof QueryParamMedian) {
        const rParam = new QueryParam<TDbType, TRParamName extends string ? TRParamName : never, TValueType>(rightValue.name);

        if (leftValue instanceof QueryParamMedian) {
            const lParam = new QueryParam<TDbType, TLParamName extends string ? TLParamName : never, TValueType>(leftValue.name);

            return new ColumnComparisonOperation(
                comparisonOperations.between,
                this,
                [lParam, rParam]
            );
        }

        return new ColumnComparisonOperation(
            comparisonOperations.between,
            this,
            [leftValue, rParam]
        );

    }

    return new ColumnComparisonOperation(
        comparisonOperations.between,
        this,
        [leftValue, rightValue]
    );
}

export default between;
