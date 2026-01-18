import { dbTypes } from "../db.js";
import { generateSQLCaseFn } from "../query/caseExpression.js";
import { generateLiteralValueFn } from "../query/literalValue.js";
import { generateParamFn } from "../query/param.js";

const paramTester = generateParamFn(dbTypes.postgresql);
const literalTester = generateLiteralValueFn(dbTypes.postgresql);
const caseTester = generateSQLCaseFn(dbTypes.postgresql);

export {
    paramTester,
    literalTester,
    caseTester
}