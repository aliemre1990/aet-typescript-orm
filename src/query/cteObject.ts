import type { DbType } from "../db.js";
import type { DbValueTypes } from "../table/column.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, queryBuilderContextFactory, type IComparable, type QueryBuilderContext } from "./_interfaces/IComparable.js";
import type { IName } from "./_interfaces/IName.js";
import between from "./comparisons/between.js";
import eq from "./comparisons/eq.js";
import sqlIn from "./comparisons/in.js";
import notEq from "./comparisons/notEq.js";
import type QueryParam from "./param.js";
import type { CTEType, ResultShape } from "./queryBuilder.js";
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
    notEq: typeof notEq = notEq;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;

    as<TAsName extends string>(val: TAsName) {
        return new CTEObjectEntry<TDbType, TComparable, TValueType, TFinalValueType, TDefaultFieldKey, TAsName>(this.dbType, this.comparable, val, this.ownerName);
    }

    ownerName?: string;
    setOwnerName(val: string): CTEObjectEntry<TDbType, TComparable, TValueType, TFinalValueType, TDefaultFieldKey, TAsName> {
        return new CTEObjectEntry<TDbType, TComparable, TValueType, TFinalValueType, TDefaultFieldKey, TAsName>(this.dbType, this.comparable, this.asName, val);
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        return { query: `"${this.ownerName}"."${this.asName || this.defaultFieldKey}"`, params: context.params };
    }

    constructor(
        dbType: TDbType,
        comparable: TComparable,
        asName?: TAsName,
        ownerName?: string,
        defaultFieldKey?: TDefaultFieldKey
    ) {
        this.dbType = dbType;
        this.comparable = comparable;
        this.asName = asName;
        this.ownerName = ownerName;

        this.defaultFieldKey = defaultFieldKey || (comparable.asName === undefined ? comparable.defaultFieldKey : comparable.asName);
    }
}

class CTEObject<
    TDbType extends DbType,
    TCTEName extends string,
    TCTEType extends CTEType,
    TQb extends QueryBuilder<TDbType, any, any, any, ResultShape<TDbType>, any, any>,
    TEntries extends readonly CTEObjectEntry<TDbType, any, any, any, any, any>[] = TQb extends QueryBuilder<TDbType, any, any, any, infer TRes, any, any> ? TRes extends ResultShape<TDbType> ? MapResultToCTEObjectEntry<TDbType, TRes> : never : never,
    TAs extends string | undefined = undefined
> implements IName<TAs extends undefined ? TCTEName : TAs> {
    dbType: TDbType;

    qb: TQb;

    asName?: TAs;
    name: TAs extends undefined ? TCTEName : TAs;
    cteName: TCTEName;
    isColumnListPresent?: boolean;

    cteType: TCTEType;
    cteObjectEntries: TEntries;

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        let query = this.qb.buildSQL(context);
        return { query: query.query, params: [...(query.params)] };
    }

    constructor(
        dbType: TDbType,
        qb: TQb,
        cteName: TCTEName,
        cteType: TCTEType,
        entries?: TEntries,
        asName?: TAs,
        isColumnListPresent?: boolean
    ) {
        this.dbType = dbType;
        this.qb = qb;
        this.cteName = cteName;
        this.name = (asName || cteName) as TAs extends undefined ? TCTEName : TAs;
        this.asName = asName;
        this.cteType = cteType;
        this.isColumnListPresent = isColumnListPresent;

        if (entries !== undefined) {
            this.cteObjectEntries = entries;
        } else {
            let tmpEntries: readonly CTEObjectEntry<TDbType, any, any, any, any, any>[] = [];
            if (qb.selectResult !== undefined) {
                qb.selectResult.forEach(res => {
                    tmpEntries = [...tmpEntries, (new CTEObjectEntry(dbType, res, undefined, this.cteName))];
                })
            }

            this.cteObjectEntries = tmpEntries as TEntries;
        }
    }

    as<TAs extends string>(val: TAs) {
        const newEntries = this.cteObjectEntries
            .map(ent => new CTEObjectEntry(ent.dbType, ent.comparable, ent.asName, val, ent.defaultFieldKey)) as readonly CTEObjectEntry<TDbType, any, any, any, any, any>[] as TEntries;

        return new CTEObject<TDbType, TCTEName, TCTEType, TQb, TEntries, TAs>(this.dbType, this.qb, this.cteName, this.cteType, newEntries, val);
    }
}

export default CTEObject;

export {
    CTEObjectEntry
}

export type {
    MapResultToCTEObjectEntry
}