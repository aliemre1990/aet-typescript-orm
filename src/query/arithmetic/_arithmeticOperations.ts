import { dbTypes, type DbType, type MySQLDbType, type PgDbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import between from "../comparisons/between.js";
import eq from "../comparisons/eq.js";
import sqlIn from "../comparisons/in.js";
import type { InferParamsFromFnArgs } from "../_types/inferParamsFromArgs.js";
import type { InferTypeName, InferTypeNamesFromArgs } from "../_types/comparableIdInference.js";


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


type InferArithmeticOpId<
    TDbType extends DbType,
    TArithmeticOperation extends ArithmeticOperation,
    TArgs extends (

        DbValueTypes | null |
        IComparable<TDbType, any, any, any, any, true, any>
    )[],
    TReturnType extends DbValueTypes | null,
    TAs extends string | undefined = undefined
> =
    `${Lowercase<TArithmeticOperation["symbol"]>}(${InferTypeNamesFromArgs<TArgs>}):${InferTypeName<TReturnType>} as ${TAs extends string ? TAs : "undefined"}`
    ;

class SQLArithmeticOperation<
    TDbType extends DbType,
    TArithmeticOperation extends ArithmeticOperation,
    TArgs extends (

        DbValueTypes | null |
        IComparable<TDbType, any, any, any, any, true, any>
    )[],
    TReturnType extends DbValueTypes | null,
    TIsAgg extends boolean = false,
    TAs extends string | undefined = undefined,
    TComparableId extends string = InferArithmeticOpId<TDbType, TArithmeticOperation, TArgs, TReturnType, TAs>
> implements IComparable<TDbType, TComparableId, InferParamsFromFnArgs<TArgs>, NonNullable<TReturnType>, TReturnType, TIsAgg, TAs> {

    icomparableValueDummy?: NonNullable<TReturnType>;
    icomparableFinalValueDummy?: TReturnType;
    icomparableIdDummy?: TComparableId;
    params?: InferParamsFromFnArgs<TArgs>;
    isAgg?: TIsAgg;
    asName?: TAs;

    eq: typeof eq = eq;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;

    as<TAs extends string>(asName: TAs) {
        return new SQLArithmeticOperation<TDbType, TArithmeticOperation, TArgs, TReturnType, TIsAgg, TAs>(this.dbType, this.args, this.operation, asName);
    }

    constructor(
        public dbType: TDbType,
        public args: TArgs,
        public operation: TArithmeticOperation,
        asName?: TAs
    ) {
        this.asName = asName;
    }
}

export default SQLArithmeticOperation;

export {
    arithmeticOperations
}

export type {
    ArithmeticOperation
}