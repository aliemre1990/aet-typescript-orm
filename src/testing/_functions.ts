import { dbTypes } from "../db.js";
import { generateLiteralValueFn } from "../query/literalValue.js";
import { generateParamFn } from "../query/param.js";

const paramTester = generateParamFn(dbTypes.postgresql);
const literalTester = generateLiteralValueFn(dbTypes.postgresql);

export {
    paramTester,
    literalTester
}