import type { DbType, PgDbType } from "../db.js";
import type { PgValueTypes } from "../postgresql/dataTypes.js";

class QueryParamMedian<TName extends string> {
    constructor(public name: TName) { }
}

class QueryParam<
    TDbType extends DbType,
    TName extends string,
    TValue extends TDbType extends PgDbType ? PgValueTypes : never
> {
    constructor(public name: TName) { }
}

function param<
    TName extends string
>(
    name: TName
) {
    return new QueryParamMedian<TName>(name);
}

export default QueryParam;

export {
    QueryParamMedian,
    param
}