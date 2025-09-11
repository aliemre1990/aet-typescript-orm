import type { DbType } from "../../db.js"
import type { generateAnd } from "../logicalOperations.js"

type LogicalOperators<TDbType extends DbType> = {
    and: ReturnType<typeof generateAnd<TDbType>>
}

type DbOperators<TDbType extends DbType> = LogicalOperators<TDbType>;


export {
    DbOperators
}