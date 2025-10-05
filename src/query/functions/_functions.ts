import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import { IComparableFinalValueDummySymbol, IComparableIdDummySymbol, IComparableValueDummySymbol, type IComparable } from "../_interfaces/IComparable.js";
import between from "../comparisons/between.js";
import eq from "../comparisons/eq.js";
import sqlIn from "../comparisons/in.js";
import type { InferParamsFromFnArgs } from "../_types/inferParamsFromArgs.js";
import type { InferTypeName, InferTypeNamesFromArgs } from "../_types/comparableIdInference.js";

const sqlFunctions = {
    coalesce: { name: 'COALESCE' },
    round: { name: 'ROUND' },
    jsonBuildObject: { name: 'JSON_BUILD_OBJECT' }

} as const;


type SQLFunction = (typeof sqlFunctions)[keyof typeof sqlFunctions];


type InferIdFromFunction<
    TDbType extends DbType,
    TSQLFunction extends SQLFunction,
    TArgs extends (
        DbValueTypes | null |
        IComparable<TDbType, any, any, any, any, any, any, any>
    )[],
    TReturnType extends DbValueTypes | null,
    TAs extends string | undefined = undefined
> =
    `${Lowercase<TSQLFunction["name"]>}(${InferTypeNamesFromArgs<TArgs>}):${InferTypeName<TReturnType>} as ${TAs extends string ? TAs : "undefined"}`
    ;

class ColumnSQLFunction<
    TDbType extends DbType,
    TSQLFunction extends SQLFunction,
    TArgs extends (
        DbValueTypes | null |
        IComparable<TDbType, any, any, any, any, any, any, any>
    )[],
    TReturnType extends DbValueTypes | null,
    TIsAgg extends boolean = false,
    TAs extends string | undefined = undefined,
    TDefaultFieldKey extends string = `${TSQLFunction["name"]}()`,
    TComparableId extends string = InferIdFromFunction<TDbType, TSQLFunction, TArgs, TReturnType, TAs>
> implements IComparable<TDbType, TComparableId, InferParamsFromFnArgs<TArgs>, NonNullable<TReturnType>, TReturnType, TIsAgg, TDefaultFieldKey, TAs> {

    [IComparableValueDummySymbol]?: NonNullable<TReturnType>;
    [IComparableFinalValueDummySymbol]?: TReturnType;
    [IComparableIdDummySymbol]?: TComparableId;
    
    params?: InferParamsFromFnArgs<TArgs>;
    isAgg?: TIsAgg;
    defaultFieldKey: TDefaultFieldKey;

    asName?: TAs;

    eq: typeof eq = eq;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;

    as<TAs extends string>(asName: TAs) {
        return new ColumnSQLFunction<TDbType, TSQLFunction, TArgs, TReturnType, TIsAgg, TAs, TDefaultFieldKey>(this.dbType, this.args, this.sqlFunction, asName, this.ownerName);
    }


    ownerName?: string;
    setOwnerName(val: string): ColumnSQLFunction<TDbType, TSQLFunction, TArgs, TReturnType, TIsAgg, TAs, TDefaultFieldKey, TComparableId> {
        return new ColumnSQLFunction<TDbType, TSQLFunction, TArgs, TReturnType, TIsAgg, TAs, TDefaultFieldKey, TComparableId>(this.dbType, this.args, this.sqlFunction, this.asName, val);
    }

    constructor(
        public dbType: TDbType,
        public args: TArgs,
        public sqlFunction: TSQLFunction,
        asName?: TAs,
        ownerName?: string
    ) {
        this.asName = asName;
        this.ownerName = ownerName;
        this.defaultFieldKey = `${sqlFunction.name}()` as TDefaultFieldKey;
    }
}

export default ColumnSQLFunction;

export {
    sqlFunctions
}

export type {
    SQLFunction
}