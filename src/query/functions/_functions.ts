import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import { IComparableFinalValueDummySymbol, IComparableIdDummySymbol, IComparableValueDummySymbol, type IComparable } from "../_interfaces/IComparable.js";
import between from "../comparisons/between.js";
import eq from "../comparisons/eq.js";
import sqlIn from "../comparisons/in.js";
import type { InferParamsFromFnArgs } from "../_types/inferParamsFromArgs.js";
import type { InferTypeName, InferTypeNamesFromArgs } from "../_types/comparableIdInference.js";
import type QueryParam from "../param.js";

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
    TParams extends QueryParam<TDbType, string, any, any, any, any>[] | undefined = InferParamsFromFnArgs<TArgs>,
    TIsAgg extends boolean = false,
    TAs extends string | undefined = undefined,
    TDefaultFieldKey extends string = `${TSQLFunction["name"]}()`,
    TComparableId extends string = InferIdFromFunction<TDbType, TSQLFunction, TArgs, TReturnType, TAs>
> implements IComparable<TDbType, TComparableId, TParams, NonNullable<TReturnType>, TReturnType, TIsAgg, TDefaultFieldKey, TAs> {

    dbType: TDbType;
    args: TArgs;
    sqlFunction: TSQLFunction;

    [IComparableValueDummySymbol]?: NonNullable<TReturnType>;
    [IComparableFinalValueDummySymbol]?: TReturnType;
    [IComparableIdDummySymbol]?: TComparableId;

    params?: TParams;
    isAgg?: TIsAgg;
    defaultFieldKey: TDefaultFieldKey;

    asName?: TAs;

    eq: typeof eq = eq;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;

    as<TAs extends string>(asName: TAs) {
        return new ColumnSQLFunction<TDbType, TSQLFunction, TArgs, TReturnType, TParams, TIsAgg, TAs, TDefaultFieldKey>(this.dbType, this.args, this.sqlFunction, asName, this.ownerName);
    }


    ownerName?: string;
    setOwnerName(val: string): ColumnSQLFunction<TDbType, TSQLFunction, TArgs, TReturnType, TParams, TIsAgg, TAs, TDefaultFieldKey, TComparableId> {
        return new ColumnSQLFunction<TDbType, TSQLFunction, TArgs, TReturnType, TParams, TIsAgg, TAs, TDefaultFieldKey, TComparableId>(this.dbType, this.args, this.sqlFunction, this.asName, val);
    }

    constructor(
        dbType: TDbType,
        args: TArgs,
        sqlFunction: TSQLFunction,
        asName?: TAs,
        ownerName?: string
    ) {
        this.dbType = dbType;
        this.args = args;
        this.sqlFunction = sqlFunction;
        this.asName = asName;
        this.ownerName = ownerName;
        this.defaultFieldKey = `${sqlFunction.name}()` as TDefaultFieldKey;

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