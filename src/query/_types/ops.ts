import type { DbType, PgDbType } from "../../db.js"
import type { DeepPrettify } from "../../utility/common.js"
import type { generateCoalesceFn } from "../functions/coalesce.js"
import type { jsonbBuildObjectFn, jsonBuildObjectFn } from "../functions/jsonFunctions/jsonBuildObject.js"
import type { generateAnd } from "../logicalOperations.js"
import type { generateParamFn } from "../param.js"

type LogicalOperators<TDbType extends DbType> = {
    and: ReturnType<typeof generateAnd<TDbType>>
}

type PgFunctions = {
    jsonBuildObject: typeof jsonBuildObjectFn;
    jsonbBuildObject: typeof jsonbBuildObjectFn;
}

type DbFunctions<TDbType extends DbType> = DeepPrettify<
    {
        param: ReturnType<typeof generateParamFn<TDbType>>
    } &
    {
        coalesce: ReturnType<typeof generateCoalesceFn<TDbType>>
    } &
    (TDbType extends PgDbType ? PgFunctions : never)
>;


type DbOperators<TDbType extends DbType> = DeepPrettify<
    LogicalOperators<TDbType> &
    DbFunctions<TDbType>
>;


export {
    DbOperators,
    DbFunctions
}