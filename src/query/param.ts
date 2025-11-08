import { dbTypes, type DbType } from "../db.js";
import type { DbValueTypes } from "../table/column.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, queryBuilderContextFactory, type IComparable, type QueryBuilderContext } from "./_interfaces/IComparable.js";
import between from "./comparisons/between.js";
import eq from "./comparisons/eq.js";
import sqlIn from "./comparisons/in.js";

class QueryParam<
    TDbType extends DbType,
    TName extends string,
    TValueType extends DbValueTypes | null,
    TAs extends string | undefined = undefined,
    TDefaultFieldKey extends string = `$${TName}`
>
    implements IComparable<TDbType, [QueryParam<TDbType, TName, TValueType>], NonNullable<TValueType>, TValueType, TDefaultFieldKey, TAs> {

    dbType: TDbType;

    params?: [QueryParam<TDbType, TName, TValueType>];
    [IComparableValueDummySymbol]?: NonNullable<TValueType>;
    [IComparableFinalValueDummySymbol]?: TValueType;
    isAgg?: false;

    name: TName;
    asName?: TAs;
    defaultFieldKey: TDefaultFieldKey;

    constructor(dbType: TDbType, name: TName, asName?: TAs, ownerName?: string) {
        this.dbType = dbType;
        this.name = name;
        this.asName = asName;
        this.ownerName = ownerName;

        this.defaultFieldKey = `$${name}` as TDefaultFieldKey;

        this.params = [this] as [QueryParam<TDbType, TName, TValueType>];
    }

    as<TAs extends string>(asName: TAs) {
        return new QueryParam<TDbType, TName, TValueType, TAs, TDefaultFieldKey>(this.dbType, this.name, asName, this.ownerName);
    }

    ownerName?: string;
    setOwnerName(val: string): QueryParam<TDbType, TName, TValueType, TAs, TDefaultFieldKey> {
        return new QueryParam<TDbType, TName, TValueType, TAs, TDefaultFieldKey>(this.dbType, this.name, this.asName, val);
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
        return new QueryParam<TDbType, TName, TValueType, TAs, TDefaultFieldKey>(this.dbType, this.name, this.asName);
    }

    eq: typeof eq = eq;
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