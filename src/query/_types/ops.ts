import type { DbType, MySQLDbType, PgDbType } from "../../db.js"
import type { jsonAggFn, jsonbAggFn } from "../aggregation/json/jsonAgg.js"
import type generateSumFn from "../aggregation/sum.js"
import type { generateArithmeticAddition } from "../arithmetic/addition.js"
import type { generateArithmeticExponentiation } from "../arithmetic/exponentiation.js"
import type { generateCoalesceFn } from "../functions/coalesce.js"
import type { jsonbBuildObjectFn, jsonBuildObjectFn } from "../functions/jsonFunctions/jsonBuildObject.js"
import type generateRoundFn from "../functions/round.js"
import type { generateAndFn, } from "../logicalOperations.js"
import type { generateParamFn } from "../param.js"

type PgArithmeticAddition = ReturnType<typeof generateArithmeticAddition<PgDbType>>;
type MySqlArithmeticAddition = ReturnType<typeof generateArithmeticAddition<MySQLDbType>>;

type PgArithmeticExponentiation = ReturnType<typeof generateArithmeticExponentiation<PgDbType>>;

type ArithmeticOperations<TDbType extends DbType> = {
    arithmeticAdd: TDbType extends PgDbType ? PgArithmeticAddition : MySqlArithmeticAddition
} &
    (TDbType extends PgDbType ? { arithmeticExponentiation: PgArithmeticExponentiation } : {});


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


type PgAggregationFunction = {
    jsonAgg: typeof jsonAggFn,
    jsonbAgg: typeof jsonbAggFn
}

type AggregationFunctions<TDbType extends DbType> = {
    sum: TDbType extends PgDbType ? PgSumFn : TDbType extends MySQLDbType ? MySQLSumFn : never
} &
    (TDbType extends PgDbType ? PgAggregationFunction : {})



type PgFunctions = {
    jsonBuildObject: typeof jsonBuildObjectFn;
    jsonbBuildObject: typeof jsonbBuildObjectFn;
}

type DbFunctions<TDbType extends DbType, TIsAgg extends boolean> =
    {
        param: TDbType extends PgDbType ? PgParamFn : TDbType extends MySQLDbType ? MySqlParamFn : never;
    } &
    {
        coalesce: TDbType extends PgDbType ? PgCoalesceFn : TDbType extends MySQLDbType ? MySQLCoalesceFn : never,
        round: TDbType extends PgDbType ? PgRoundFn : TDbType extends MySQLDbType ? MySQLRoundFn : never
    } &
    (TIsAgg extends true ? AggregationFunctions<TDbType> : {}) &
    (TDbType extends PgDbType ? PgFunctions : {}) &
    ArithmeticOperations<TDbType>
    ;


type DbOperators<TDbType extends DbType, TIsAgg extends boolean> =
    LogicalOperators<TDbType> &
    DbFunctions<TDbType, TIsAgg>
    ;


export {
    DbOperators,
    DbFunctions
}