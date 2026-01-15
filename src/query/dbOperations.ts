import { dbTypes, type DbType, type MySQLDbType, type PgDbType } from "../db.js"
import type { AggregationFunctions, ArithmeticOperations, DbFunctions, DbOperators, LogicalOperators } from "./_types/ops.js"
import generateAvgFn from "./aggregation/avg.js"
import { jsonAggFn, jsonbAggFn } from "./aggregation/json/jsonAgg.js"
import generateSumFn from "./aggregation/sum.js"
import { generateArithmeticAddition } from "./arithmetic/addition.js"
import { generateArithmeticDivision } from "./arithmetic/division.js"
import { generateArithmeticExponentiation } from "./arithmetic/exponentiation.js"
import { generateArithmeticModulo } from "./arithmetic/modulo.js"
import { generateArithmeticMultiplication } from "./arithmetic/multiplication.js"
import { generateArithmeticSubtraction } from "./arithmetic/subtract.js"
import { generateCoalesceFn } from "./functions/coalesce.js"
import { jsonbBuildObjectFn, jsonBuildObjectFn } from "./functions/jsonFunctions/jsonBuildObject.js"
import generateRoundFn from "./functions/round.js"
import { generateLiteralValueFn } from "./literalValue.js"
import { generateAndFn, generateOrFn } from "./logicalOperations.js"
import { generateParamFn } from "./param.js"

/**
 * Aggregation operations
 */
function generateCommonAggregationFunctions<TDbType extends DbType>(dbType: TDbType) {
    return {
        sum: generateSumFn<TDbType>(dbType),
        avg: generateAvgFn<TDbType>(dbType)
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
        arithmeticAddition: generateArithmeticAddition(dbType),
        arithmeticSubtraction: generateArithmeticSubtraction(dbType),
        arithmeticMultiplication: generateArithmeticMultiplication(dbType),
        arithmeticDivision: generateArithmeticDivision(dbType),
        arithmeticModulo: generateArithmeticModulo(dbType)
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
        literal: generateLiteralValueFn(dbType),

        coalesce: generateCoalesceFn(dbType),
        round: generateRoundFn(dbType),
    }
}


const pgFunctions: DbFunctions<PgDbType> = {
    ...generateCommonFunctions(dbTypes.postgresql),

    jsonBuildObject: jsonBuildObjectFn,
    jsonbBuildObject: jsonbBuildObjectFn,

    ...pgArithmeticOperations,
    ...pgAggregationFunctions
}


const mysqlFunctions: DbFunctions<MySQLDbType> = {
    ...generateCommonFunctions(dbTypes.mysql),

    ...mysqlArithmeticOperations,
    ...mysqlAggregationFunctions
}



/**
 * Logical Operations
 */
function generateCommonLogicalOperators<TDbType extends DbType>(dbType: TDbType) {
    return {
        and: generateAndFn(dbType),
        or: generateOrFn(dbType)
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
const pgDbOperators: DbOperators<PgDbType> = {
    ...pgLogicalOperators,
    ...pgFunctions
}


const mysqlDbOperators: DbOperators<MySQLDbType> = {
    ...mysqlLogicalOperators,
    ...mysqlFunctions
}


export {
    pgFunctions,
    mysqlFunctions,
    pgDbOperators,
    mysqlDbOperators
}