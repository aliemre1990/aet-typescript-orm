import { dbTypes, type DbType, type MySQLDbType, type PgDbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, queryBuilderContextFactory, type IComparable, type QueryBuilderContext } from "../_interfaces/IComparable.js";
import between from "../comparisons/between.js";
import eq from "../comparisons/eq.js";
import sqlIn from "../comparisons/in.js";
import type { InferParamsFromFnArgs } from "../_types/inferParamsFromArgs.js";
import type QueryParam from "../param.js";
import { convertArgsToQueryString } from "../functions/_functions.js";


const arithmeticOperations = {
    addition: {
        name: 'ADDITION',
        symbol: "+"
    },
    subtraction: {
        name: 'SUBTRACTION',
        symbol: "-"
    },
    multiplication: {
        name: 'MULTIPLICATION',
        symbol: "*"
    },
    divison: {
        name: 'DIVISION',
        symbol: "/"
    },
    module: {
        name: 'MODULE',
        symbol: "%"
    },
    exponentiation: {
        name: 'EXPONENTIATION',
        symbol: "^"
    }
} as const;


type ArithmeticOperation = typeof arithmeticOperations[keyof typeof arithmeticOperations];


class SQLArithmeticOperation<
    TDbType extends DbType,
    TArithmeticOperation extends ArithmeticOperation,
    TArgs extends (
        DbValueTypes | null |
        IComparable<TDbType, any, any, any, any, any>
    )[],
    TReturnType extends DbValueTypes | null,
    TAs extends string | undefined = undefined,
    TDefaultFieldKey extends string = `${TArithmeticOperation["name"]}()`,
    TParams extends QueryParam<TDbType, string, any, any, any>[] | undefined = InferParamsFromFnArgs<TArgs>
> implements IComparable<TDbType, TParams, NonNullable<TReturnType>, TReturnType, TDefaultFieldKey, TAs> {

    dbType: TDbType;
    args: TArgs;
    operation: TArithmeticOperation;

    [IComparableValueDummySymbol]?: NonNullable<TReturnType>;
    [IComparableFinalValueDummySymbol]?: TReturnType;

    params?: TParams;
    asName?: TAs;
    defaultFieldKey: TDefaultFieldKey;

    eq: typeof eq = eq;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;

    as<TAs extends string>(asName: TAs) {
        return new SQLArithmeticOperation<TDbType, TArithmeticOperation, TArgs, TReturnType, TAs, TDefaultFieldKey, TParams>(this.dbType, this.args, this.operation, asName);
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        const argsStrArr = convertArgsToQueryString(this.args, context);
        const queryRes = argsStrArr.join(`${this.operation.symbol} `);

        return { query: queryRes, params: [...(context?.params || [])] };
    }

    constructor(
        dbType: TDbType,
        args: TArgs,
        operation: TArithmeticOperation,
        asName?: TAs
    ) {
        this.dbType = dbType;
        this.args = args;
        this.operation = operation;
        this.asName = asName;
        this.defaultFieldKey = `${operation.name}()` as TDefaultFieldKey;
    }
}

export default SQLArithmeticOperation;

export {
    arithmeticOperations
}

export type {
    ArithmeticOperation
}