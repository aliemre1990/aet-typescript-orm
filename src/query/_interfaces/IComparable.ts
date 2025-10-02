import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type QueryParam from "../param.js";
import type between from "../comparisons/between.js";
import type eq from "../comparisons/eq.js";
import type sqlIn from "../comparisons/in.js";
import type { IDbType } from "./IDbType.js";

const IComparableValueDummySymbol = Symbol();
const IComparableFinalValueDummySymbol = Symbol();
const IComparableIdDummySymbol = Symbol();

interface IComparable<
    TDbType extends DbType,
    TComparableId extends string,
    TParams extends QueryParam<TDbType, string, any, any, any, any>[] | undefined,
    TValueType extends DbValueTypes,
    TFinalValueType extends TValueType | null,
    TIsAgg extends boolean,
    TDefaultFieldKey extends string,
    TAs extends string | undefined
> extends IDbType<TDbType> {
    dbType: TDbType;

    [IComparableValueDummySymbol]?: TValueType;
    [IComparableFinalValueDummySymbol]?: TFinalValueType;
    [IComparableIdDummySymbol]?: TComparableId;

    params?: TParams;
    isAgg?: TIsAgg;
    asName?: TAs;
    defaultFieldKey: TDefaultFieldKey;

    ownerName?: string;
    setOwnerName(val: string): IComparable<TDbType, TComparableId, TParams, TValueType, TFinalValueType, TIsAgg, TDefaultFieldKey, TAs>;


    eq: typeof eq;
    sqlIn: typeof sqlIn;
    between: typeof between;

    as<TAs extends string>(asName: TAs): IComparable<TDbType, string, TParams, TValueType, TFinalValueType, TIsAgg, TDefaultFieldKey, TAs>
}

export type {
    IComparable
}

export {
    IComparableValueDummySymbol,
    IComparableFinalValueDummySymbol,
    IComparableIdDummySymbol
}