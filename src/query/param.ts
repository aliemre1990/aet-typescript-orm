import { dbTypes, type DbType } from "../db.js";
import type { DbValueTypes } from "../table/column.js";
import type { PgColumnType } from "../table/columnTypes.js";
import type { IsAny } from "../utility/common.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, queryBuilderContextFactory, type DetermineFinalValueType, type DetermineValueType, type IComparable, type QueryBuilderContext } from "./_interfaces/IComparable.js";
import between from "./comparisons/between.js";
import eq from "./comparisons/eq.js";
import gt from "./comparisons/gt.js";
import gte from "./comparisons/gte.js";
import sqlIn from "./comparisons/in.js";
import lt from "./comparisons/lt.js";
import lte from "./comparisons/lte.js";
import notEq from "./comparisons/notEq.js";

const paramDefaultColumnName = '?column?';
type TParameDefaultColumnName = typeof paramDefaultColumnName;

class QueryParam<
    TDbType extends DbType,
    TName extends string,
    TValueType extends DbValueTypes | null,
    TAs extends string | undefined = undefined,
    TDefaultFieldKey extends string = TParameDefaultColumnName,
    TCastType extends PgColumnType | undefined = undefined
>
    implements IComparable<
        TDbType,
        [QueryParam<TDbType, TName, TValueType>],
        DetermineValueType<TCastType, NonNullable<TValueType>>,
        DetermineFinalValueType<IsAny<TValueType> extends true ? DetermineValueType<TCastType, TValueType> | null : TValueType, DetermineValueType<TCastType, NonNullable<TValueType>>>,
        TDefaultFieldKey,
        TAs,
        TCastType
    > {

    dbType: TDbType;

    params?: [QueryParam<TDbType, TName, TValueType>];
    [IComparableValueDummySymbol]?: DetermineValueType<TCastType, NonNullable<TValueType>>;
    [IComparableFinalValueDummySymbol]?: DetermineFinalValueType<IsAny<TValueType> extends true ? DetermineValueType<TCastType, TValueType> | null : TValueType, DetermineValueType<TCastType, NonNullable<TValueType>>>;

    name: TName;
    asName?: TAs;
    castType?: TCastType;
    defaultFieldKey: TDefaultFieldKey;

    constructor(dbType: TDbType, name: TName, asName?: TAs, ownerName?: string, castType?: TCastType) {
        this.dbType = dbType;
        this.name = name;
        this.asName = asName;
        this.castType = castType;
        this.ownerName = ownerName;

        this.defaultFieldKey = paramDefaultColumnName as TDefaultFieldKey;

        this.params = [this] as [QueryParam<TDbType, TName, TValueType, any, any, any>];
    }

    as<TAs extends string>(asName: TAs) {
        return new QueryParam<TDbType, TName, TValueType, TAs, TDefaultFieldKey, TCastType>(this.dbType, this.name, asName, this.ownerName, this.castType);
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new QueryParam<TDbType, TName, TValueType, TAs, TDefaultFieldKey, TCastType>(this.dbType, this.name, this.asName, this.ownerName, type);
    }

    ownerName?: string;
    setOwnerName(val: string): QueryParam<TDbType, TName, TValueType, TAs, TDefaultFieldKey, TCastType> {
        return new QueryParam<TDbType, TName, TValueType, TAs, TDefaultFieldKey, TCastType>(this.dbType, this.name, this.asName, val, this.castType);
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        let paramIndex = context.params.indexOf(this.name);
        if (paramIndex < 0) {
            paramIndex = context.params.push(this.name) - 1;
        }

        return { query: `$${paramIndex + 1}`, params: context.params };
    }

    type<TValueType extends DbValueTypes | null>() {
        return new QueryParam<TDbType, TName, TValueType, TAs, TDefaultFieldKey, TCastType>(this.dbType, this.name, this.asName, this.ownerName, this.castType);
    }

    eq: typeof eq = eq;
    notEq: typeof notEq = notEq;
    gt: typeof gt = gt;
    gte: typeof gte = gte;
    lt: typeof lt = lt;
    lte: typeof lte = lte;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;
}



/**
 * This causes infinite loop
 */
function generateParamFn<
    TDbType extends DbType
>(dbType: TDbType) {
    return <
        TName extends string = string,
    >(
        name: TName
    ) => {
        return new QueryParam<TDbType, TName, any>(dbType, name);
    }
}

export default QueryParam;

export {
    generateParamFn
}