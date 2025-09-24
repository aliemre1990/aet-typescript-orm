import { dbTypes, type DbType } from "../db.js";
import type { DbValueTypes } from "../table/column.js";
import type { IComparable } from "./_interfaces/IComparable.js";
import type { InferTypeName } from "./_types/comparableIdInference.js";
import between from "./comparisons/between.js";
import eq from "./comparisons/eq.js";
import sqlIn from "./comparisons/in.js";

type InferIdFromParam<TName extends string, TValueType extends DbValueTypes | null> = `$${TName}::${InferTypeName<TValueType>}`;

class QueryParam<
    TDbType extends DbType,
    TName extends string,
    TValueType extends DbValueTypes | null,
    TAs extends string | undefined = undefined,
    TComparableId extends string = InferIdFromParam<TName, TValueType>

>
    implements IComparable<TDbType, TComparableId, [QueryParam<TDbType, TName, TValueType>], NonNullable<TValueType>, TValueType, false, TAs> {

    dbType: TDbType;

    params?: [QueryParam<TDbType, TName, TValueType>];
    icomparableValueDummy?: NonNullable<TValueType>;
    icomparableFinalValueDummy?: TValueType;
    icomparableIdDummy?: TComparableId;
    isAgg?: false;

    asName?: TAs;

    constructor(dbType: TDbType, public name: TName, asName?: TAs) {
        this.dbType = dbType;
        this.asName = asName;
    }

    as<TAs extends string>(asName: TAs) {
        return new QueryParam<TDbType, TName, TValueType, TAs>(this.dbType, this.name, asName);
    }

    type<TValueType extends DbValueTypes | null>() {
        return new QueryParam<TDbType, TName, TValueType, TAs>(this.dbType, this.name, this.asName);
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