import { dbTypes, type DbType } from "../db.js";
import type { DbValueTypes } from "../table/column.js";
import type { IComparable } from "./comparisons/_interfaces/IComparable.js";

class QueryParam<
    TDbType extends DbType,
    TName extends string,
    TValueType extends DbValueTypes | null
>
    implements IComparable<TDbType, [QueryParam<TDbType, TName, TValueType>], NonNullable<TValueType>, TValueType, false> {

    params?: [QueryParam<TDbType, TName, TValueType>];
    icomparableValueDummy?: NonNullable<TValueType>;
    icomparableFinalValueDummy?: TValueType;
    isAgg?: false;

    constructor(public dbType: TDbType, public name: TName) { }

    type<TValueType extends DbValueTypes | null>() {
        return new QueryParam<TDbType, TName, TValueType>(this.dbType, this.name);
    }
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