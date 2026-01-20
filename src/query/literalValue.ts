import type { DbType } from "../db.js";
import type { DbValueTypes } from "../table/column.js";
import type { PgColumnType } from "../table/columnTypes.js";
import {
    IComparableFinalValueDummySymbol,
    IComparableValueDummySymbol,
    queryBuilderContextFactory,
    type DetermineFinalValueType,
    type DetermineValueType,
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
    TAs extends string | undefined = undefined,
    TCastType extends PgColumnType | undefined = undefined
> implements IComparable<
    TDbType,
    undefined,
    DetermineValueType<TCastType, NonNullable<TValue>>,
    DetermineFinalValueType<TValue, DetermineValueType<TCastType, NonNullable<TValue>>>,
    TLiteralValueColumnName,
    TAs,
    TCastType
> {
    [IComparableValueDummySymbol]?: DetermineValueType<TCastType, NonNullable<TValue>>;
    [IComparableFinalValueDummySymbol]?: DetermineFinalValueType<TValue, DetermineValueType<TCastType, NonNullable<TValue>>>;


    dbType: TDbType;
    defaultFieldKey: TLiteralValueColumnName;
    params?: undefined;
    asName?: TAs;
    castType?: TCastType;

    value: TValue;

    eq: typeof eq = eq;
    notEq: typeof notEq = notEq;
    gt: typeof gt = gt;
    gte: typeof gte = gte;
    lt: typeof lt = lt;
    lte: typeof lte = lte;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;

    as<TAs extends string>(asName: TAs) {
        return new LiteralValue<TDbType, TValue, TAs, TCastType>(this.dbType, this.value, asName, this.castType);
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new LiteralValue<TDbType, TValue, TAs, TCastType>(this.dbType, this.value, this.asName, type);
    }

    buildSQL(context?: QueryBuilderContext): { query: string; params: string[]; } {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        let query = convertValueToQueryString(this.value);
        query = this.asName ? `${query} AS "${this.asName}"` : query;

        return { query, params: context.params };
    }

    constructor(dbType: TDbType, value: TValue, asName?: TAs, castType?: TCastType) {
        this.dbType = dbType;
        this.value = value;
        this.defaultFieldKey = literalValueColumnName;
        this.asName = asName;
        this.castType = castType;
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