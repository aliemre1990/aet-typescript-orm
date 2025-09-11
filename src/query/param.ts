import type { DbType, DbValueTypes, PgDbType } from "../db.js";
import type { PgValueTypes } from "../postgresql/dataTypes.js";

class QueryParam<
    TDbType extends DbType,
    TName extends string,
    TValue extends DbValueTypes | null
> {
    constructor(public name: TName) { }
}

function generateParamFn<
    TDbType extends DbType
>(dbType: TDbType) {
    return <
        TName extends string,
        TValueType extends DbValueTypes | null = any
    >(
        name: TName
    ) => {
        return new QueryParam<TDbType, TName, TValueType>(name);
    }
}

export default QueryParam;

export {
    generateParamFn
}