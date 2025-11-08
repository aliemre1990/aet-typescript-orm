import type { DbType } from "../db.js";
import type { DbValueTypes } from "../table/column.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, type IComparable, type QueryBuilderContext } from "./_interfaces/IComparable.js";
import type { IName } from "./_interfaces/IName.js";
import between from "./comparisons/between.js";
import eq from "./comparisons/eq.js";
import sqlIn from "./comparisons/in.js";
import type QueryParam from "./param.js";
import type { ResultShape } from "./queryBuilder.js";
import type QueryBuilder from "./queryBuilder.js";

type MapResultToSubQueryEntry<TDbType extends DbType, TComparables extends ResultShape<TDbType>> =
    TComparables extends readonly [infer First, ...infer Rest] ?
    First extends IComparable<TDbType, any, any, any, any, any> ?
    Rest extends ResultShape<TDbType> ?
    [SubQueryEntry<TDbType, First>, ...MapResultToSubQueryEntry<TDbType, Rest>] :
    [SubQueryEntry<TDbType, First>] :
    [] :
    []
    ;

class SubQueryEntry<
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
        return new SubQueryEntry<TDbType, TComparable, TValueType, TFinalValueType, TDefaultFieldKey, TAsName>(this.dbType, this.comparable, val, this.ownerName);
    }

    ownerName?: string;
    setOwnerName(val: string): SubQueryEntry<TDbType, TComparable, TValueType, TFinalValueType, TDefaultFieldKey, TAsName> {
        return new SubQueryEntry<TDbType, TComparable, TValueType, TFinalValueType, TDefaultFieldKey, TAsName>(this.dbType, this.comparable, this.asName, val);
    }

    buildSQL(context?: QueryBuilderContext) {
        return { query: `${this.ownerName}.${this.asName || this.defaultFieldKey}`, params: [...(context?.params || [])] };
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

class SubQueryObject<
    TDbType extends DbType,
    TQb extends QueryBuilder<TDbType, any, any, any, ResultShape<TDbType>, any, string>,
    TEntries extends readonly SubQueryEntry<TDbType, any, any, any, any, any>[] = TQb extends QueryBuilder<TDbType, any, any, any, infer TRes extends ResultShape<TDbType>, any, string> ? MapResultToSubQueryEntry<TDbType, TRes> : never,
    TName extends string = TQb extends QueryBuilder<TDbType, any, any, any, any, any, infer TAsName> ? TAsName : never,
> implements IName<TName> {
    dbType: TDbType;
    qb: TQb;
    name: TName;
    subQueryEntries: TEntries;

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = { params: [] };
        }

        let query = this.qb.buildSQL(context);
        return { query: query.query, params: [...(query.params)] };
    }


    constructor(
        dbType: TDbType,
        qb: TQb
    ) {
        this.dbType = dbType;
        this.qb = qb;
        this.name = qb.asName as TName;

        let tmpEntries: readonly SubQueryEntry<TDbType, any, any, any, any, any>[] = [];
        if (qb.selectResult !== undefined) {
            qb.selectResult.forEach(res => {
                tmpEntries = [...tmpEntries, (new SubQueryEntry(dbType, res, undefined, qb.asName))];
            })
        }

        this.subQueryEntries = tmpEntries as TEntries;
    }
}

export default SubQueryObject;

export {
    SubQueryEntry
}

export type {
    MapResultToSubQueryEntry
}