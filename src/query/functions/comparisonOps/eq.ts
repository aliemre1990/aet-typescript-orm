import type { DbType, PgDbType } from "../../../db.js";
import type { JsTypeToPgTypes, PgValueTypes } from "../../../postgresql/dataTypes.js";
import type Column from "../../../table/column.js";
import ColumnComparisonOperation, { comparisonOperations } from "../../comparisons/_comparisonOperations.js";
import { QueryParamMedian } from "../../param.js";
import QueryParam from "../../param.js";
import type QueryColumn from "../../queryColumn.js";
import type { SQLFunction } from "../_functions.js";
import type ColumnSQLFunction from "../_functions.js";

function functionEq<
    TDbType extends DbType,
    TSQLFunction extends SQLFunction,
    TArgs extends (
        PgValueTypes | null |
        QueryParam<TDbType, any, any> |
        QueryColumn<TDbType, any, any, any> |
        ColumnSQLFunction<TDbType, any, any, TReturnType>
    )[],
    TReturnType extends TDbType extends PgDbType ? PgValueTypes : never,
    TAppliedQColumn extends QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TDbType, TReturnType>, any, any>, any, any>,
>(this: ColumnSQLFunction<TDbType, TSQLFunction, TArgs, TReturnType>, value: TAppliedQColumn): ColumnComparisonOperation<
    TDbType,
    ColumnSQLFunction<TDbType, TSQLFunction, TArgs, TReturnType>,
    undefined,
    [TAppliedQColumn],
    undefined
>
function functionEq<
    TDbType extends DbType,
    TSQLFunction extends SQLFunction,
    TArgs extends (
        PgValueTypes | null |
        QueryParam<TDbType, any, any> |
        QueryColumn<TDbType, any, any, any> |
        ColumnSQLFunction<TDbType, any, any, TReturnType>
    )[],
    TReturnType extends TDbType extends PgDbType ? PgValueTypes : never,
    TAppliedSQLFunction extends ColumnSQLFunction<TDbType, any, any, TReturnType>,
>(this: ColumnSQLFunction<TDbType, TSQLFunction, TArgs, TReturnType>, value: TAppliedSQLFunction): ColumnComparisonOperation<
    TDbType,
    ColumnSQLFunction<TDbType, TSQLFunction, TArgs, TReturnType>,
    undefined,
    undefined,
    [TAppliedSQLFunction]
>
function functionEq<
    TDbType extends DbType,
    TSQLFunction extends SQLFunction,
    TArgs extends (
        PgValueTypes | null |
        QueryParam<TDbType, any, any> |
        QueryColumn<TDbType, any, any, any> |
        ColumnSQLFunction<TDbType, any, any, TReturnType>
    )[],
    TReturnType extends TDbType extends PgDbType ? PgValueTypes : never,
    TParamMedian extends QueryParamMedian<any>,
    TParamName extends TParamMedian extends QueryParamMedian<infer U> ? U : never,
    TParam extends QueryParam<TDbType, TParamName, TReturnType>
>(this: ColumnSQLFunction<TDbType, TSQLFunction, TArgs, TReturnType>, value: TParamMedian
): ColumnComparisonOperation<
    TDbType,
    ColumnSQLFunction<TDbType, TSQLFunction, TArgs, TReturnType>,
    [TParam],
    undefined,
    undefined
>
function functionEq<
    TDbType extends DbType,
    TSQLFunction extends SQLFunction,
    TArgs extends (
        PgValueTypes | null |
        QueryParam<TDbType, any, any> |
        QueryColumn<TDbType, any, any, any> |
        ColumnSQLFunction<TDbType, any, any, TReturnType>
    )[],
    TReturnType extends TDbType extends PgDbType ? PgValueTypes : never
>(this: ColumnSQLFunction<TDbType, TSQLFunction, TArgs, TReturnType>, value: TReturnType): ColumnComparisonOperation<
    TDbType,
    ColumnSQLFunction<TDbType, TSQLFunction, TArgs, TReturnType>,
    undefined,
    undefined,
    undefined
>
function functionEq<
    TDbType extends DbType,
    TSQLFunction extends SQLFunction,
    TArgs extends (
        PgValueTypes | null |
        QueryParam<TDbType, any, any> |
        QueryColumn<TDbType, any, any, any> |
        ColumnSQLFunction<TDbType, any, any, TReturnType>
    )[],
    TReturnType extends TDbType extends PgDbType ? PgValueTypes : never,
    TValueType extends TReturnType,
    TParamMedian extends QueryParamMedian<any>,
    TParamName extends TParamMedian extends QueryParamMedian<infer U> ? U : never,
    TAppliedQColumn extends QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TDbType, TReturnType>, any, any, any>, any, any> | undefined,
    TAppliedSQLFunction extends ColumnSQLFunction<TDbType, any, any, TReturnType> | undefined
>
    (this: ColumnSQLFunction<TDbType, TSQLFunction, TArgs, TReturnType>, value: TValueType | TParamMedian | TAppliedQColumn | TAppliedSQLFunction) {

    if (value instanceof QueryParamMedian) {
        const param = new QueryParam<TDbType, TParamName extends string ? TParamName : never, TValueType>(value.name);

        return new ColumnComparisonOperation(
            comparisonOperations.eq,
            this,
            [param]
        )
    }


    // todo: check here later
    if (value === undefined) {
        throw Error('Value cannot be undefined');
    }

    return new ColumnComparisonOperation(
        comparisonOperations.eq,
        this,
        [value]
    );
}

export default functionEq;
