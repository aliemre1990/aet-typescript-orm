import type { DbType, PgDbType } from "../../db.js";
import type { GetArrayEquivalentPgValueType, JsTypeToPgTypes, PgTypeToJsType } from "../../postgresql/dataTypes.js";
import type Column from "../../table/column.js";
import type { ColumnType, QueryTableSpecsType } from "../../table/types/utils.js";
import type { UnionToTupleOrdered } from "../../utility/common.js";
import { isNullOrUndefined } from "../../utility/guards.js";
import type { GetColumnTypeFromDbType } from "../_types/miscellaneous.js";
import ColumnComparisonOperation, { comparisonOperations } from "../comparison.js";
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
    TValueType extends GetColumnTypeFromDbType<TDbType, TColumn>,
    TValues extends readonly (TValueType | QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TValueType>, any, any>, any, any>)[]
>(
    this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
    ...values: TValues
): ColumnComparisonOperation<
    TDbType,
    QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
    undefined,
    ExtractColumnsFromMix<TValues>, // Helper type to extract only the columns as tuple
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
    undefined
>
function sqlIn<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined,
    TParamMedian extends QueryParamMedian<any> | undefined,
    TValueType extends GetColumnTypeFromDbType<TDbType, TColumn>,
    TValues extends readonly (TValueType | QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TValueType>, any, any>, any, any>)[]
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
            this,
            comparisonOperations.in.name,
            [paramRes]
        )
    }

    return new ColumnComparisonOperation
        (
            this,
            comparisonOperations.in.name,
            [param, ...values] 
        );
}

export default sqlIn;
