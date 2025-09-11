import type { DbType } from "../../db.js"
import type { DeepPrettify } from "../../utility/common.js"
import type { generateCoalesceFn } from "../functions/coalesce.js"
import type { generateAnd } from "../logicalOperations.js"

type LogicalOperators<TDbType extends DbType> = {
    and: ReturnType<typeof generateAnd<TDbType>>
}

type Functions<TDbType extends DbType> = {
    coalesce: ReturnType<typeof generateCoalesceFn<TDbType>>
}

type DbOperators<TDbType extends DbType> = DeepPrettify<LogicalOperators<TDbType> & Functions<TDbType>>;


export {
    DbOperators
}