import { dbTypes, type DbType, type MySQLDbType, type PgDbType } from "../db.js"
import type { AggregationFunctions, ArithmeticOperations, DbFunctions, DbOperators, LogicalOperators } from "./_types/ops.js"
import { jsonAggFn, jsonbAggFn } from "./aggregation/json/jsonAgg.js"
import generateSumFn from "./aggregation/sum.js"
import { generateArithmeticAddition } from "./arithmetic/addition.js"
import { generateArithmeticExponentiation } from "./arithmetic/exponentiation.js"
import { generateCoalesceFn } from "./functions/coalesce.js"
import { jsonbBuildObjectFn, jsonBuildObjectFn } from "./functions/jsonFunctions/jsonBuildObject.js"
import generateRoundFn from "./functions/round.js"
import { generateAndFn } from "./logicalOperations.js"
import { generateParamFn } from "./param.js"

/**
 * Aggregation operations
 */
function generateCommonAggregationFunctions<TDbType extends DbType>(dbType: TDbType) {
    return {
        sum: generateSumFn<TDbType>(dbType)
    }
}

const pgAggregationFunctions: AggregationFunctions<PgDbType> = {
    jsonAgg: jsonAggFn,
    jsonbAgg: jsonbAggFn,
    ...generateCommonAggregationFunctions(dbTypes.postgresql)
}

const mysqlAggregationFunctions: AggregationFunctions<MySQLDbType> = {
    ...generateCommonAggregationFunctions(dbTypes.mysql)
}

/**
 * Arithmetic operations
 */
function generateCommonArithmeticOperations<TDbType extends DbType>(dbType: TDbType) {
    return {
        arithmeticAdd: generateArithmeticAddition(dbType),
    }
}


const pgArithmeticOperations: ArithmeticOperations<PgDbType> = {
    ...generateCommonArithmeticOperations(dbTypes.postgresql),
    arithmeticExponentiation: generateArithmeticExponentiation(dbTypes.postgresql)
}

const mysqlArithmeticOperations: ArithmeticOperations<MySQLDbType> = {
    ...generateCommonArithmeticOperations(dbTypes.mysql)

}

/**
 * Function
 */
function generateCommonFunctions<TDbType extends DbType>(dbType: TDbType) {
    return {
        param: generateParamFn(dbType),

        coalesce: generateCoalesceFn(dbType),
        round: generateRoundFn(dbType),
    }
}


const pgFunctions: DbFunctions<PgDbType, false> = {
    ...generateCommonFunctions(dbTypes.postgresql),

    jsonBuildObject: jsonBuildObjectFn,
    jsonbBuildObject: jsonbBuildObjectFn,

    ...pgArithmeticOperations
}

const pgFunctionsWithAggregation: DbFunctions<PgDbType, true> = {
    ...pgFunctions,
    ...pgAggregationFunctions
}

const mysqlFunctions: DbFunctions<MySQLDbType, false> = {
    ...generateCommonFunctions(dbTypes.mysql),

    ...mysqlArithmeticOperations
}

const mysqlFunctionsWithAggregation: DbFunctions<MySQLDbType, true> = {
    ...mysqlFunctions,
    ...mysqlAggregationFunctions
}


/**
 * Logical Operations
 */
function generateCommonLogicalOperators<TDbType extends DbType>(dbType: TDbType) {
    return {
        and: generateAndFn(dbType)
    }
}

const pgLogicalOperators: LogicalOperators<PgDbType> = {
    ...generateCommonLogicalOperators(dbTypes.postgresql)
}

const mysqlLogicalOperators: LogicalOperators<MySQLDbType> = {
    ...generateCommonLogicalOperators(dbTypes.mysql)
}

/**
 * All operators
 */
const pgDbOperators = {
    ...pgLogicalOperators,
    ...pgFunctions
}

const pgDbOperatorsWithAggregation = {
    ...pgLogicalOperators,
    ...pgFunctionsWithAggregation
}

const mysqlDbOperators = {
    ...mysqlLogicalOperators,
    ...mysqlFunctions
}

const mysqlDbOperatorsWithAggregation = {
    ...mysqlLogicalOperators,
    ...mysqlFunctionsWithAggregation
}


export {
    pgFunctions,
    pgFunctionsWithAggregation,
    mysqlFunctions,
    mysqlFunctionsWithAggregation
}