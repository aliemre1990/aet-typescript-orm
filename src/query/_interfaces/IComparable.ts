import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type QueryParam from "../param.js";
import type between from "../comparisons/between.js";
import type eq from "../comparisons/eq.js";
import type sqlIn from "../comparisons/in.js";
import type { IDbType } from "./IDbType.js";
import type notEq from "../comparisons/notEq.js";
import type gt from "../comparisons/gt.js";
import type gte from "../comparisons/gte.js";
import type lt from "../comparisons/lt.js";
import type lte from "../comparisons/lte.js";
import type { PgColumnType, PgTypeToJsType } from "../../table/columnTypes.js";

type DetermineValueType<TCastType extends PgColumnType | undefined, TValueType extends DbValueTypes | null> =
    TCastType extends undefined ?
    TValueType :
    TCastType extends PgColumnType ?
    object extends PgTypeToJsType<TCastType> ?
    TValueType :
    PgTypeToJsType<TCastType> :
    never;

type DetermineFinalValueType<TCurrFinalType extends DbValueTypes | null, TValueType extends DbValueTypes | null> =
    null extends TCurrFinalType ? TValueType | null : TValueType;

type QueryBuilderContext = { params: string[], isTopLevel: boolean }
function queryBuilderContextFactory(): QueryBuilderContext {
    return { params: [], isTopLevel: true }
}

const IComparableValueDummySymbol = Symbol();
const IComparableFinalValueDummySymbol = Symbol();

interface IComparable<
    TDbType extends DbType,
    TParams extends readonly QueryParam<TDbType, string, any, any, any, any>[] | undefined,
    TValueType extends DbValueTypes | null,
    TFinalValueType extends DbValueTypes | null,
    TDefaultFieldKey extends string,
    TAs extends string | undefined,
    TCastType extends PgColumnType | undefined
> extends IDbType<TDbType> {
    dbType: TDbType;

    [IComparableValueDummySymbol]?: TValueType;
    [IComparableFinalValueDummySymbol]?: TFinalValueType;
    
    params?: TParams;
    asName?: TAs;
    castType?: TCastType;
    defaultFieldKey: TDefaultFieldKey;

    eq: typeof eq;
    notEq: typeof notEq;
    gt: typeof gt;
    gte: typeof gte;
    lt: typeof lt;
    lte: typeof lte;
    sqlIn: typeof sqlIn;
    between: typeof between;

    as<TAs extends string>(asName: TAs): IComparable<TDbType, TParams, TValueType, TFinalValueType, TDefaultFieldKey, TAs, TCastType>
    cast<TCastType extends PgColumnType>(type: TCastType): IComparable<TDbType, TParams, any, any, TDefaultFieldKey, TAs, TCastType>

    buildSQL(context?: QueryBuilderContext): { query: string, params: string[] };
}

export type {
    DetermineValueType,
    DetermineFinalValueType,
    IComparable,
    QueryBuilderContext
}

export {
    IComparableValueDummySymbol,
    IComparableFinalValueDummySymbol,
    queryBuilderContextFactory
}