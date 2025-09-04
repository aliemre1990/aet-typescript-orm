import type { DbType, PgDbType } from "../../db.js";
import type { GetArrayEquivalentPgValueType, JsTypeToPgTypes } from "../../postgresql/dataTypes.js";
import type Column from "../../table/column.js";
import type { ColumnType, QueryTableSpecsType } from "../../table/types/utils.js";
import { isNullOrUndefined } from "../../utility/guards.js";
import type { GetColumnTypeFromDbType, GetColumnValueType } from "../_types/miscellaneous.js";
import ColumnComparisonOperation, { comparisonOperations } from "./_comparisonOperations.js";
import { QueryParam, QueryParamMedian } from "../queryColumn.js";
import QueryColumn from "../queryColumn.js";

// Helper type to extract only QueryColumns from the mixed tuple
type ExtractColumnsFromMix<T extends readonly unknown[]> =
    T extends readonly [infer First, ...infer Rest] ?
    First extends QueryColumn<any, any, any, any> ?
    [First, ...ExtractColumnsFromMix<Rest>] :
    ExtractColumnsFromMix<Rest> :
    [];

function sqlIn<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined,
    TValueType extends GetColumnValueType<TDbType, TColumn>,
    TValues extends readonly (TValueType | QueryColumn<TDbType, Column<TDbType, any, any, any, any, TValueType>, any, any>)[]
>(
    this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
    ...values: TValues
): ColumnComparisonOperation<
    TDbType,
    QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
    undefined,
    ExtractColumnsFromMix<TValues>["length"] extends 0 ? undefined : ExtractColumnsFromMix<TValues>, // Helper type to extract only the columns as tuple
    TValueType
>


function sqlIn<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined,
    TParamMedian extends QueryParamMedian<any>,
    TParamName extends TParamMedian extends QueryParamMedian<infer U> ? U : never,
    TParam extends QueryParam<TDbType, TParamName, TDbType extends PgDbType ? GetArrayEquivalentPgValueType<TValueType> : never>,
    TValueType extends GetColumnTypeFromDbType<TDbType, TColumn>
>(this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>, param: TParamMedian
): ColumnComparisonOperation<
    TDbType,
    QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
    [TParam],
    undefined,
    undefined
>
function sqlIn<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined,
    TParamMedian extends QueryParamMedian<any> | undefined,
    TValueType extends GetColumnValueType<TDbType, TColumn>,
    TValues extends readonly (TValueType | QueryColumn<TDbType, Column<TDbType, any, any, any, any, TValueType>, any, any>)[]
>
    (
        this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
        param: TParamMedian | TValues[number],
        ...values: TValues
    ) {

    if (isNullOrUndefined(param)) {
        throw Error('In operation requires at least one value.');
    }

    if (param instanceof QueryParamMedian) {
        const paramRes = new QueryParam(param.name);

        return new ColumnComparisonOperation(
            comparisonOperations.in,
            this,
            [paramRes]
        )
    }

    return new ColumnComparisonOperation
        (
            comparisonOperations.in,
            this,
            [param, ...values]
        );
}

export default sqlIn;
