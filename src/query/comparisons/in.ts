import type { DbType, PgDbType } from "../../db.js";
import type { GetArrayEquivalentPgValueType, JsTypeToPgTypes, PgTypeToJsType } from "../../postgresql/dataTypes.js";
import type Column from "../../table/column.js";
import type { ColumnType, QueryTableSpecsType } from "../../table/types/utils.js";
import type { UnionToTupleOrdered } from "../../utility/common.js";
import type { GetColumnTypeFromDbType } from "../_types/miscellaneous.js";
import ColumnComparisonOperation, { comparisonOperations } from "../comparison.js";
import { QueryParam, QueryParamMedian } from "../queryColumn.js";
import QueryColumn from "../queryColumn.js";

function sqlIn<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined,
    TValueType extends TDbType extends PgDbType ? PgTypeToJsType<TColumn["type"]> : never,
>(this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>, values: TValueType[]): ColumnComparisonOperation<
    TDbType,
    QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
    undefined,
    undefined
>
function sqlIn<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined,
    TValueType extends GetColumnTypeFromDbType<TDbType, TColumn>,
    TAppliedQColumns extends QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TValueType>, any, any>, any, any>[],
>(this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>, valueCols: TAppliedQColumns): ColumnComparisonOperation<
    TDbType,
    QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
    undefined,
    TAppliedQColumns
>
function sqlIn<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined,
    TValueType extends GetColumnTypeFromDbType<TDbType, TColumn>,
    TAppliedQColumns extends QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TValueType>, any, any>, any, any>[],
>(this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>, values: TValueType[], valueCols: TAppliedQColumns): ColumnComparisonOperation<
    TDbType,
    QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
    undefined,
    TAppliedQColumns extends Array<infer T> ? UnionToTupleOrdered<T> : never
>
function sqlIn<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined,
    TValueType extends GetColumnTypeFromDbType<TDbType, TColumn>,
    TAppliedQColumns extends QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TValueType>, any, any>, any, any>[],
>(this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>, valueCols: TAppliedQColumns, values: TValueType[]): ColumnComparisonOperation<
    TDbType,
    QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
    undefined,
    TAppliedQColumns extends Array<infer T> ? UnionToTupleOrdered<T> : never
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
    TParamName extends (TParamMedian extends QueryParamMedian<infer U> ? U : never) | undefined,
    TParam extends QueryParam<TDbType, TParamName extends undefined ? never : TParamName, TDbType extends PgDbType ? GetArrayEquivalentPgValueType<TValueType> : never>,
    TValueType extends GetColumnTypeFromDbType<TDbType, TColumn>,
    TAppliedQColumns extends QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TValueType>, any, any>, any, any>[] | undefined
>
    (this: QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>, values?: TValueType[], valueCols?: TAppliedQColumns, param?: TParamMedian) {

    if (param instanceof QueryParamMedian) {
        const paramRes = new QueryParam<TDbType, TParamName extends string ? TParamName : never, TDbType extends PgDbType ? GetArrayEquivalentPgValueType<TValueType> : never>(param.name);

        return new ColumnComparisonOperation(
            this,
            comparisonOperations.in.name,
            [paramRes]
        )
    }

    return new ColumnComparisonOperation<
        TDbType,
        QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>,
        undefined,
        TAppliedQColumns extends Array<infer T> ? UnionToTupleOrdered<T> : never
    >
        (
            this,
            comparisonOperations.in.name,
            [...(values === undefined ? [] : values), ...(valueCols === undefined ? [] : valueCols)] as any
        );
}

export default sqlIn;
