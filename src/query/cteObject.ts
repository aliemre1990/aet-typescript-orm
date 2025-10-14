import type { DbType } from "../db.js";
import type { DbValueTypes } from "../table/column.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, type IComparable } from "./_interfaces/IComparable.js";
import type { ResultShape } from "./_types/result.js";
import between from "./comparisons/between.js";
import eq from "./comparisons/eq.js";
import sqlIn from "./comparisons/in.js";
import type QueryParam from "./param.js";
import type { CTEType } from "./queryBuilder.js";
import type QueryBuilder from "./queryBuilder.js";

type MapResultToCTEObjectEntry<TDbType extends DbType, TComparables extends ResultShape<TDbType>> =
    TComparables extends readonly [infer First, ...infer Rest] ?
    First extends IComparable<TDbType, any, any, any, any, any> ?
    Rest extends ResultShape<TDbType> ?
    [CTEObjectEntry<TDbType, First>, ...MapResultToCTEObjectEntry<TDbType, Rest>] :
    [CTEObjectEntry<TDbType, First>] :
    [] :
    []
    ;

class CTEObjectEntry<
    TDbType extends DbType,
    TComparable extends IComparable<TDbType, any, any, any, any, any>,
    TValueType extends DbValueTypes = TComparable extends IComparable<TDbType, any, infer TValType, any, any, any> ? TValType : never,
    TFinalValueType extends TValueType | null = TComparable extends IComparable<TDbType, any, any, infer TFinalType, any, any> ? TFinalType : never,
    TDefaultFieldKey extends string = TComparable extends IComparable<TDbType, any, any, any, infer TDefaultFieldKey, infer TAs> ? TAs extends undefined ? TDefaultFieldKey : TAs : never,
    TAsName extends string | undefined = undefined
> implements IComparable<TDbType, undefined, TValueType, TFinalValueType, TDefaultFieldKey, TAsName> {
    dbType: TDbType;

    [IComparableValueDummySymbol]?: TValueType;
    [IComparableFinalValueDummySymbol]?: TFinalValueType;

    params?: undefined;
    asName?: TAsName;
    defaultFieldKey: TDefaultFieldKey;

    comparable: TComparable;

    eq: typeof eq = eq;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;

    as<TAsName extends string>(val: TAsName) {
        return new CTEObjectEntry<TDbType, TComparable, TValueType, TFinalValueType, TDefaultFieldKey, TAsName>(this.dbType, this.comparable, val, this.ownerName);
    }

    ownerName?: string;
    setOwnerName(val: string): CTEObjectEntry<TDbType, TComparable, TValueType, TFinalValueType, TDefaultFieldKey, TAsName> {
        return new CTEObjectEntry<TDbType, TComparable, TValueType, TFinalValueType, TDefaultFieldKey, TAsName>(this.dbType, this.comparable, this.asName, val);
    }


    constructor(
        dbType: TDbType,
        comparable: TComparable,
        asName?: TAsName,
        ownerName?: string
    ) {
        this.dbType = dbType;
        this.comparable = comparable;
        this.asName = asName;
        this.ownerName = ownerName;

        this.defaultFieldKey = comparable.asName === undefined ? comparable.defaultFieldKey : comparable.asName;
    }
}

class CTEObject<
    TDbType extends DbType,
    TCTEName extends string,
    TCTEType extends CTEType,
    TQb extends QueryBuilder<TDbType, any, any, any, ResultShape<TDbType>, any, any, any>,
    TEntries extends readonly CTEObjectEntry<TDbType, any, any, any, any, any>[] = TQb extends QueryBuilder<TDbType, any, any, any, infer TRes extends ResultShape<TDbType>, any, any, string> ? MapResultToCTEObjectEntry<TDbType, TRes> : never,
> {
    dbType: TDbType;
    qb: TQb;
    cteName: TCTEName;
    cteType: TCTEType;
    subQueryEntries: TEntries;

    constructor(
        dbType: TDbType,
        qb: TQb,
        cteName: TCTEName,
        cteType: TCTEType
    ) {
        this.dbType = dbType;
        this.qb = qb;
        this.cteName = cteName;
        this.cteType = cteType;

        let tmpEntries: readonly CTEObjectEntry<TDbType, any, any, any, any, any>[] = [];
        if (qb.resultSelection !== undefined) {
            qb.resultSelection.forEach(res => {
                tmpEntries = [...tmpEntries, (new CTEObjectEntry(dbType, res, undefined, cteName))];
            })
        }

        this.subQueryEntries = tmpEntries as TEntries;
    }
}

export default CTEObject;

export {
    CTEObjectEntry
}

export type {
    MapResultToCTEObjectEntry
}