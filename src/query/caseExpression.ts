import { type DbType } from "../db.js";
import type { DbValueTypes } from "../table/column.js";
import type { PgColumnType } from "../table/columnTypes.js";
import type { UndefinedIfLengthZero } from "../utility/common.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, type DetermineFinalValueType, type DetermineValueType, type IComparable, type QueryBuilderContext } from "./_interfaces/IComparable.js";
import type ColumnComparisonOperation from "./comparisons/_comparisonOperations.js";
import between from "./comparisons/between.js";
import eq from "./comparisons/eq.js";
import gt from "./comparisons/gt.js";
import gte from "./comparisons/gte.js";
import sqlIn from "./comparisons/in.js";
import lt from "./comparisons/lt.js";
import lte from "./comparisons/lte.js";
import notEq from "./comparisons/notEq.js";
import type ColumnLogicalOperation from "./logicalOperations.js";
import type QueryParam from "./param.js";

type AccumulateCaseParams<
    TParams extends QueryParam<any, any, any, any, any, any>[] | undefined = undefined,
    TCaseParams extends QueryParam<any, any, any, any, any, any>[] | undefined = undefined,
    TCaseResultParams extends QueryParam<any, any, any, any, any, any>[] | undefined = undefined
> =
    [
        ...(TParams extends undefined ? [] : TParams),
        ...(TCaseParams extends undefined ? [] : TCaseParams),
        ...(TCaseResultParams extends undefined ? [] : TCaseResultParams)
    ]

const defaultCaseExpressionFieldName = 'case';
type defaultCaseExpressionFieldNameType = typeof defaultCaseExpressionFieldName;

class SQLCaseExpression<
    TDbType extends DbType,
    TResult extends DbValueTypes | null = never,
    TMainExpression extends IComparable<TDbType, any, any, any, any, any, any> | undefined = undefined,
    TParams extends QueryParam<TDbType, string, any, any, any, any>[] | undefined = undefined,
    TAs extends string | undefined = undefined,
    TCastType extends PgColumnType | undefined = undefined,
> implements IComparable<
    TDbType,
    TParams,
    DetermineValueType<TCastType, NonNullable<TResult>>,
    DetermineFinalValueType<TResult, DetermineValueType<TCastType, NonNullable<TResult>>>,
    defaultCaseExpressionFieldNameType,
    TAs,
    TCastType
> {
    [IComparableValueDummySymbol]?: DetermineValueType<TCastType, NonNullable<TResult>>;
    [IComparableFinalValueDummySymbol]?: DetermineFinalValueType<TResult, DetermineValueType<TCastType, NonNullable<TResult>>>;


    defaultFieldKey: defaultCaseExpressionFieldNameType;

    dbType: TDbType;
    params?: TParams | undefined;
    asName?: TAs | undefined;
    castType?: TCastType;

    eq: typeof eq = eq;
    notEq: typeof notEq = notEq;
    gt: typeof gt = gt;
    gte: typeof gte = gte;
    lt: typeof lt = lt;
    lte: typeof lte = lte;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;

    as<TAs extends string>(asName: TAs) {
        return new SQLCaseExpression<TDbType, TResult, TMainExpression, TParams, TAs, TCastType>(this.dbType, asName, this.castType, this.mainExpression);
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new SQLCaseExpression<TDbType, TResult, TMainExpression, TParams, TAs, TCastType>(this.dbType, this.asName, type, this.mainExpression);
    }
    buildSQL(context?: QueryBuilderContext): { query: string; params: string[]; } {
        throw new Error("Method not implemented.");
    }

    mainExpression?: TMainExpression;
    elseVal?: IComparable<TDbType, any, any, any, any, any, any> | DbValueTypes | null;

    constructor(dbType: TDbType, asName?: TAs, castType?: TCastType, mainExpression?: TMainExpression, elseVal?: typeof this.elseVal) {
        this.dbType = dbType;
        this.asName = asName;
        this.defaultFieldKey = defaultCaseExpressionFieldName;
        this.castType = castType;

        this.mainExpression = mainExpression;
        this.elseVal = elseVal;
    }

    // when<
    //     TWhen extends TMainExpression extends undefined ? IComparable<TDbType, any, any, any, any, any> : (ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>),
    //     TCaseResult extends IComparable<TDbType, any, any, any, any, any> | DbValueTypes | null
    // >(expression: TWhen, result: TCaseResult): SQLCaseExpression<
    //     TDbType,
    //     TResult | TCaseResult,
    //     TMainExpression,
    //     UndefinedIfLengthZero<AccumulateCaseParams<TParams, TWhen["params"], TCaseResult extends IComparable<TDbType, infer TCaseResultParams, any, any, any, any> ? TCaseResultParams : undefined>>,



    // > {

    // }

}

function generateSQLCaseFn<
    TDbType extends DbType
>(dbType: TDbType) {

    function sqlCase<TExpression extends IComparable<TDbType, any, any, any, any, any, any>>(expression: TExpression):
        SQLCaseExpression<TDbType, never, TExpression, TExpression extends IComparable<TDbType, infer TParams, any, any, any, any, any> ? TParams : never>
    function sqlCase():
        SQLCaseExpression<TDbType, never, undefined, undefined>
    function sqlCase<
        TExpression extends IComparable<TDbType, any, any, any, any, any, any> | undefined
    >(expression?: TExpression) {
        return new SQLCaseExpression<
            TDbType,
            never,
            TExpression,
            TExpression extends undefined ? undefined : (TExpression extends IComparable<TDbType, infer TParams, any, any, any, any, any> ? TParams : never)
        >(dbType, undefined, undefined, expression);
    }

    return sqlCase;
}

export default SQLCaseExpression;

export {
    generateSQLCaseFn
}