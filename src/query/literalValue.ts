import type { DbType } from "../db.js";
import type { DbValueTypes } from "../table/column.js";
import {
    IComparableFinalValueDummySymbol,
    IComparableValueDummySymbol,
    queryBuilderContextFactory,
    type IComparable,
    type QueryBuilderContext
} from "./_interfaces/IComparable.js";
import between from "./comparisons/between.js";
import eq from "./comparisons/eq.js";
import gt from "./comparisons/gt.js";
import gte from "./comparisons/gte.js";
import sqlIn from "./comparisons/in.js";
import lt from "./comparisons/lt.js";
import lte from "./comparisons/lte.js";
import notEq from "./comparisons/notEq.js";
import { convertValueToQueryString } from "./uitlity/common.js";

const literalValueColumnName = '?column?';
type TLiteralValueColumnName = typeof literalValueColumnName;

class LiteralValue<
    TDbType extends DbType,
    TValue extends DbValueTypes | null,
    TAs extends string | undefined = undefined
> implements IComparable<TDbType, undefined, NonNullable<TValue>, TValue, TLiteralValueColumnName, TAs> {
    [IComparableValueDummySymbol]?: NonNullable<TValue>;
    [IComparableFinalValueDummySymbol]?: TValue;


    dbType: TDbType;
    defaultFieldKey: TLiteralValueColumnName;
    params?: undefined;
    asName?: TAs;

    value: TValue;

    eq: typeof eq = eq;
    notEq: typeof notEq = notEq;
    gt: typeof gt = gt;
    gte: typeof gte = gte;
    lt: typeof lt = lt;
    lte: typeof lte = lte;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;

    as<TAs extends string>(asName: TAs): IComparable<TDbType, undefined, NonNullable<TValue>, TValue, TLiteralValueColumnName, TAs> {
        return new LiteralValue<TDbType, TValue, TAs>(this.dbType, this.value, asName);
    }
    buildSQL(context?: QueryBuilderContext): { query: string; params: string[]; } {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        let query = convertValueToQueryString(this.value);
        query = this.asName ? `${query} AS "${this.asName}"` : query;

        return { query, params: context.params };
    }

    constructor(dbType: TDbType, value: TValue, asName?: TAs) {
        this.dbType = dbType;
        this.value = value;
        this.defaultFieldKey = literalValueColumnName;
        this.asName = asName;
    }
}


/**
 * This causes infinite loop
 */
function generateLiteralValueFn<TDbType extends DbType>(dbType: TDbType) {
    return <TValue extends DbValueTypes>(
        value: TValue
    ) => {
        return new LiteralValue<TDbType, TValue>(dbType, value);
    }
}


export default LiteralValue;

export {
    generateLiteralValueFn
}