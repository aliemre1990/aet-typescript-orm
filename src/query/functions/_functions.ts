import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, queryBuilderContextFactory, type DetermineFinalValueType, type DetermineValueType, type IComparable, type QueryBuilderContext } from "../_interfaces/IComparable.js";
import between from "../comparisons/between.js";
import eq from "../comparisons/eq.js";
import sqlIn from "../comparisons/in.js";
import type { InferParamsFromFnArgs } from "../_types/inferParamsFromArgs.js";
import type QueryParam from "../param.js";
import notEq from "../comparisons/notEq.js";
import gt from "../comparisons/gt.js";
import gte from "../comparisons/gte.js";
import lt from "../comparisons/lt.js";
import lte from "../comparisons/lte.js";
import QueryBuilder from "../queryBuilder.js";
import { convertArgsToQueryString } from "../uitlity/common.js";
import type { PgColumnType } from "../../table/columnTypes.js";

const sqlFunctions = {
    coalesce: { name: 'COALESCE' },
    round: { name: 'ROUND' },
    jsonBuildObject: { name: 'JSON_BUILD_OBJECT' }

} as const;


type SQLFunction = (typeof sqlFunctions)[keyof typeof sqlFunctions];

class ColumnSQLFunction<
    TDbType extends DbType,
    TSQLFunction extends SQLFunction,
    TArgs extends (
        DbValueTypes | null |
        IComparable<TDbType, any, any, any, any, any, any>
    )[],
    TReturnType extends DbValueTypes | null,
    TParams extends QueryParam<TDbType, string, any, any, any, any>[] | undefined = InferParamsFromFnArgs<TArgs>,
    TAs extends string | undefined = undefined,
    TDefaultFieldKey extends string = `${Lowercase<TSQLFunction["name"]>}`,
    TCastType extends PgColumnType | undefined = undefined
> implements IComparable<
    TDbType,
    TParams,
    DetermineValueType<TCastType, NonNullable<TReturnType>>,
    DetermineFinalValueType<TReturnType, DetermineValueType<TCastType, NonNullable<TReturnType>>>,
    TDefaultFieldKey,
    TAs,
    TCastType
> {

    dbType: TDbType;
    args: TArgs;
    sqlFunction: TSQLFunction;

    [IComparableValueDummySymbol]?: DetermineValueType<TCastType, NonNullable<TReturnType>>;
    [IComparableFinalValueDummySymbol]?: DetermineFinalValueType<TReturnType, DetermineValueType<TCastType, NonNullable<TReturnType>>>;

    params?: TParams;
    defaultFieldKey: TDefaultFieldKey;

    asName?: TAs;
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
        return new ColumnSQLFunction<TDbType, TSQLFunction, TArgs, TReturnType, TParams, TAs, TDefaultFieldKey, TCastType>(this.dbType, this.args, this.sqlFunction, asName, this.castType);
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new ColumnSQLFunction<TDbType, TSQLFunction, TArgs, TReturnType, TParams, TAs, TDefaultFieldKey, TCastType>(this.dbType, this.args, this.sqlFunction, this.asName, type);
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        const argsStrArr = convertArgsToQueryString(this.args, context);
        const argsStrRes = argsStrArr.join(', ');
        const queryRes = `${this.sqlFunction.name.toUpperCase()}(${argsStrRes})${this.asName ? ` AS "${this.asName}"` : ''}`;

        return { query: queryRes, params: context.params };
    }

    constructor(
        dbType: TDbType,
        args: TArgs,
        sqlFunction: TSQLFunction,
        asName?: TAs,
        castType?: TCastType
    ) {
        this.dbType = dbType;
        this.args = args;
        this.sqlFunction = sqlFunction;
        this.asName = asName;
        this.castType = castType;
        this.defaultFieldKey = `${sqlFunction.name.toLowerCase()}` as TDefaultFieldKey;

        let tmpParams: QueryParam<TDbType, any, any, any, any, any>[] = [];

        for (const arg of args) {
            if (
                arg instanceof Object &&
                "params" in arg &&
                arg.params !== undefined &&
                arg.params.length > 0
            ) {
                tmpParams.push(...arg.params);
            }
        }

        if (tmpParams.length > 0) {
            this.params = tmpParams as TParams;
        }
    }
}

export default ColumnSQLFunction;

export {
    sqlFunctions
}

export type {
    SQLFunction
}