import type { DbType, MySQLDbType, PgDbType } from "../../db.js"
import type generateAvgFn from "../aggregation/avg.js"
import type { jsonAggFn, jsonbAggFn } from "../aggregation/json/jsonAgg.js"
import type generateSumFn from "../aggregation/sum.js"
import type { generateArithmeticAddition } from "../arithmetic/addition.js"
import type { generateArithmeticDivision } from "../arithmetic/division.js"
import type { generateArithmeticExponentiation } from "../arithmetic/exponentiation.js"
import type { generateArithmeticModulo } from "../arithmetic/modulo.js"
import type { generateArithmeticMultiplication } from "../arithmetic/multiplication.js"
import type { generateArithmeticSubtraction } from "../arithmetic/subtract.js"
import type { generateCoalesceFn } from "../functions/coalesce.js"
import type { jsonbBuildObjectFn, jsonBuildObjectFn } from "../functions/jsonFunctions/jsonBuildObject.js"
import type generateRoundFn from "../functions/round.js"
import type { generateAndFn, generateOrFn, } from "../logicalOperations.js"
import type { generateParamFn } from "../param.js"

type PgArithmeticAddition = ReturnType<typeof generateArithmeticAddition<PgDbType>>;
type MySQLArithmeticAddition = ReturnType<typeof generateArithmeticAddition<MySQLDbType>>;
type PgArithmeticSubtraction = ReturnType<typeof generateArithmeticSubtraction<PgDbType>>;
type MySQLArithmeticSubtraction = ReturnType<typeof generateArithmeticSubtraction<MySQLDbType>>;
type PgArithmeticMultiplication = ReturnType<typeof generateArithmeticMultiplication<PgDbType>>;
type MySQLArithmeticMultiplication = ReturnType<typeof generateArithmeticMultiplication<MySQLDbType>>;
type PgArithmeticDivision = ReturnType<typeof generateArithmeticDivision<PgDbType>>;
type MySQLArithmeticDivision = ReturnType<typeof generateArithmeticDivision<MySQLDbType>>;
type PgArithmeticModulo = ReturnType<typeof generateArithmeticModulo<PgDbType>>;
type MySQLArithmeticModulo = ReturnType<typeof generateArithmeticModulo<MySQLDbType>>;

type PgArithmeticExponentiation = ReturnType<typeof generateArithmeticExponentiation<PgDbType>>;

type ArithmeticOperations<TDbType extends DbType> = {
    arithmeticAddition: TDbType extends PgDbType ? PgArithmeticAddition : MySQLArithmeticAddition,
    arithmeticSubtraction: TDbType extends PgDbType ? PgArithmeticSubtraction : MySQLArithmeticSubtraction,
    arithmeticMultiplication: TDbType extends PgDbType ? PgArithmeticMultiplication : MySQLArithmeticMultiplication,
    arithmeticDivision: TDbType extends PgDbType ? PgArithmeticDivision : MySQLArithmeticDivision,
    arithmeticModulo: TDbType extends PgDbType ? PgArithmeticModulo : MySQLArithmeticModulo
} &
    (TDbType extends PgDbType ? { arithmeticExponentiation: PgArithmeticExponentiation } : {});


type PgParamFn = ReturnType<typeof generateParamFn<PgDbType>>;
type MySqlParamFn = ReturnType<typeof generateParamFn<MySQLDbType>>;

type PgCoalesceFn = ReturnType<typeof generateCoalesceFn<PgDbType>>;
type MySQLCoalesceFn = ReturnType<typeof generateCoalesceFn<MySQLDbType>>;
type PgRoundFn = ReturnType<typeof generateRoundFn<PgDbType>>;
type MySQLRoundFn = ReturnType<typeof generateRoundFn<MySQLDbType>>;



/**
 * Comparison operations
 */
type PgAndFn = ReturnType<typeof generateAndFn<PgDbType>>;
type MySQLAndFn = ReturnType<typeof generateAndFn<MySQLDbType>>;

type PgOrFn = ReturnType<typeof generateOrFn<PgDbType>>;
type MySQLOrFn = ReturnType<typeof generateOrFn<MySQLDbType>>;

type LogicalOperators<TDbType extends DbType> = {
    and: TDbType extends PgDbType ? PgAndFn : TDbType extends MySQLDbType ? MySQLAndFn : never,
    or: TDbType extends PgDbType ? PgOrFn : TDbType extends MySQLDbType ? MySQLOrFn : never;
}

/**
 * Aggregation
 */
type PgAggregationFunction = {
    jsonAgg: typeof jsonAggFn,
    jsonbAgg: typeof jsonbAggFn
}

type PgSumFn = ReturnType<typeof generateSumFn<PgDbType>>;
type MySQLSumFn = ReturnType<typeof generateSumFn<MySQLDbType>>;
type PgAvgFn = ReturnType<typeof generateAvgFn<PgDbType>>;
type MySQLAvgFn = ReturnType<typeof generateAvgFn<MySQLDbType>>;

type AggregationFunctions<TDbType extends DbType> = {
    sum: TDbType extends PgDbType ? PgSumFn : TDbType extends MySQLDbType ? MySQLSumFn : never,
    avg: TDbType extends PgDbType ? PgAvgFn : TDbType extends MySQLDbType ? MySQLAvgFn : never,
} &
    (TDbType extends PgDbType ? PgAggregationFunction : {})



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
    (TDbType extends PgDbType ? PgFunctions : {}) &
    ArithmeticOperations<TDbType>
    ;


type DbOperators<TDbType extends DbType> =
    LogicalOperators<TDbType> &
    DbFunctions<TDbType>
    ;


export {
    DbOperators,
    DbFunctions,
    AggregationFunctions,
    ArithmeticOperations,
    LogicalOperators
}