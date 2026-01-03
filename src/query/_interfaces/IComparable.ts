import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type QueryParam from "../param.js";
import type between from "../comparisons/between.js";
import type eq from "../comparisons/eq.js";
import type sqlIn from "../comparisons/in.js";
import type { IDbType } from "./IDbType.js";
import type notEq from "../comparisons/notEq.js";

type QueryBuilderContext = { params: string[], isTopLevel: boolean }
function queryBuilderContextFactory(): QueryBuilderContext {
    return { params: [], isTopLevel: true }
}

const IComparableValueDummySymbol = Symbol();
const IComparableFinalValueDummySymbol = Symbol();

interface IComparable<
    TDbType extends DbType,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined,
    TValueType extends DbValueTypes,
    TFinalValueType extends TValueType | null,
    TDefaultFieldKey extends string,
    TAs extends string | undefined
> extends IDbType<TDbType> {
    dbType: TDbType;

    [IComparableValueDummySymbol]?: TValueType;
    [IComparableFinalValueDummySymbol]?: TFinalValueType;

    params?: TParams;
    asName?: TAs;
    defaultFieldKey: TDefaultFieldKey;

    eq: typeof eq;
    notEq: typeof notEq;
    sqlIn: typeof sqlIn;
    between: typeof between;

    as<TAs extends string>(asName: TAs): IComparable<TDbType, TParams, TValueType, TFinalValueType, TDefaultFieldKey, TAs>

    buildSQL(context?: QueryBuilderContext): { query: string, params: string[] };
}

export type {
    IComparable,
    QueryBuilderContext
}

export {
    IComparableValueDummySymbol,
    IComparableFinalValueDummySymbol,
    queryBuilderContextFactory
}