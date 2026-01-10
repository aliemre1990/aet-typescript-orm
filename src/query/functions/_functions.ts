import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, queryBuilderContextFactory, type IComparable, type QueryBuilderContext } from "../_interfaces/IComparable.js";
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
        IComparable<TDbType, any, any, any, any, any>
    )[],
    TReturnType extends DbValueTypes | null,
    TParams extends QueryParam<TDbType, string, any, any, any>[] | undefined = InferParamsFromFnArgs<TArgs>,
    TAs extends string | undefined = undefined,
    TDefaultFieldKey extends string = `${Lowercase<TSQLFunction["name"]>}`
> implements IComparable<TDbType, TParams, NonNullable<TReturnType>, TReturnType, TDefaultFieldKey, TAs> {

    dbType: TDbType;
    args: TArgs;
    sqlFunction: TSQLFunction;

    [IComparableValueDummySymbol]?: NonNullable<TReturnType>;
    [IComparableFinalValueDummySymbol]?: TReturnType;

    params?: TParams;
    defaultFieldKey: TDefaultFieldKey;

    asName?: TAs;

    eq: typeof eq = eq;
    notEq: typeof notEq = notEq;
    gt: typeof gt = gt;
    gte: typeof gte = gte;
    lt: typeof lt = lt;
    lte: typeof lte = lte;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;

    as<TAs extends string>(asName: TAs) {
        return new ColumnSQLFunction<TDbType, TSQLFunction, TArgs, TReturnType, TParams, TAs, TDefaultFieldKey>(this.dbType, this.args, this.sqlFunction, asName);
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
        asName?: TAs
    ) {
        this.dbType = dbType;
        this.args = args;
        this.sqlFunction = sqlFunction;
        this.asName = asName;
        this.defaultFieldKey = `${sqlFunction.name.toLowerCase()}` as TDefaultFieldKey;

        let tmpParams: QueryParam<TDbType, any, any, any, any>[] = [];

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

function convertArgsToQueryString(args: (DbValueTypes | null | IComparable<any, any, any, any, any, any>)[], context?: QueryBuilderContext) {
    if (context === undefined) {
        context = queryBuilderContextFactory();
    }

    let argQueries = [];
    for (const arg of args) {
        if (typeof arg === 'object' && arg !== null && 'buildSQL' in arg) {
            argQueries.push(arg.buildSQL(context).query);
        } else if (arg === null) {
            argQueries.push('NULL');
        } else if (typeof arg === "string") {
            argQueries.push(`'${arg}'`);
        } else if (typeof arg === 'boolean') {
            argQueries.push(String(arg).toUpperCase());
        } else if (arg instanceof Buffer) {
            argQueries.push(`${arg.toString('utf-8')}`);
        } else if (typeof arg === 'object') {
            argQueries.push(JSON.stringify(arg));
        } else {
            argQueries.push(arg.toString());
        }
    }

    return argQueries;
}

export default ColumnSQLFunction;

export {
    sqlFunctions,
    convertArgsToQueryString
}

export type {
    SQLFunction
}