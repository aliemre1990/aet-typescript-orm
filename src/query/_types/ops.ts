import type { DbType, MySQLDbType, PgDbType } from "../../db.js"
import type { DeepPrettify } from "../../utility/common.js"
import type generateSumFn from "../aggregation/sum.js"
import type { generateCoalesceFn } from "../functions/coalesce.js"
import type { jsonbBuildObjectFn, jsonBuildObjectFn } from "../functions/jsonFunctions/jsonBuildObject.js"
import type generateRoundFn from "../functions/round.js"
import type { generateAndFn, } from "../logicalOperations.js"
import type { generateParamFn } from "../param.js"

type PgParamFn = ReturnType<typeof generateParamFn<PgDbType>>;
type MySqlParamFn = ReturnType<typeof generateParamFn<MySQLDbType>>;

type PgCoalesceFn = ReturnType<typeof generateCoalesceFn<PgDbType>>;
type MySQLCoalesceFn = ReturnType<typeof generateCoalesceFn<MySQLDbType>>;
type PgRoundFn = ReturnType<typeof generateRoundFn<PgDbType>>;
type MySQLRoundFn = ReturnType<typeof generateRoundFn<MySQLDbType>>;

type PgAndFn = ReturnType<typeof generateAndFn<PgDbType>>;
type MySQLAndFn = ReturnType<typeof generateAndFn<MySQLDbType>>;

type PgSumFn = ReturnType<typeof generateSumFn<PgDbType>>;
type MySQLSumFn = ReturnType<typeof generateSumFn<MySQLDbType>>;

/**
 * 
 */
type LogicalOperators<TDbType extends DbType> = {
    and: TDbType extends PgDbType ? PgAndFn : TDbType extends MySQLDbType ? MySQLAndFn : never
}

type AggregationFunctions<TDbType extends DbType> = {
    sum: TDbType extends PgDbType ? PgSumFn : TDbType extends MySQLDbType ? MySQLSumFn : never
}

type PgFunctions = {
    jsonBuildObject: typeof jsonBuildObjectFn;
    jsonbBuildObject: typeof jsonbBuildObjectFn;
}

type DbFunctions<TDbType extends DbType> =
    {
        param: TDbType extends PgDbType ? PgParamFn : TDbType extends MySQLDbType ? MySqlParamFn : never;
    } &
    {
        coalesce: TDbType extends PgDbType ? PgCoalesceFn : TDbType extends MySQLDbType ? MySQLCoalesceFn : never,
        round: TDbType extends PgDbType ? PgRoundFn : TDbType extends MySQLDbType ? MySQLRoundFn : never
    } &
    AggregationFunctions<TDbType> &
    (TDbType extends PgDbType ? PgFunctions : never)
    ;


type DbOperators<TDbType extends DbType> = DeepPrettify<
    LogicalOperators<TDbType> &
    DbFunctions<TDbType>
>;


export {
    DbOperators,
    DbFunctions
}