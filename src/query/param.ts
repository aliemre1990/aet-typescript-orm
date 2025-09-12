import { dbTypes, type DbType, type DbValueTypes } from "../db.js";
import type { IComparable } from "./comparisons/_interfaces/IComparable.js";

class QueryParam<
    TDbType extends DbType,
    TName extends string,
    TValue extends DbValueTypes | null
>
// implements IComparable<TDbType, [QueryParam<TDbType, TName, TValue>], NonNullable<TValue>, TValue, false> 

{

    // params?: [QueryParam<TDbType, TName, TValue>];
    // icomparableValueDummy?: NonNullable<TValue>;
    // icomparableFinalValueDummy?: TValue;
    // isAgg?: false;

    constructor(public dbType: TDbType, public name: TName) { }
}



/**
 * This causes infinite loop
 */
function generateParamFn<
    TDbType extends DbType
>(dbType: TDbType) {
    return <
        TName extends string,
        TValueType extends DbValueTypes | null = any
    >(
        name: TName
    ) => {
        return new QueryParam<TDbType, TName, TValueType>(dbType, name);
    }
}

export default QueryParam;

export {
    generateParamFn
}