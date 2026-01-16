import type ColumnComparisonOperation from "../../../query/comparisons/_comparisonOperations.js";
import type QueryParam from "../../../query/param.js";
import { customerIdQC, empSalaryQC } from "../../_columns.js";
import { literalTester, paramTester } from "../../_functions.js";
import type { AssertEqual, AssertTrue } from "../_typeTestingUtilities.js";

//
const eqToValue = customerIdQC.eq(1);
//@ts-expect-error
const eqToInvalidValue = customerIdQC.eq("ali");
//
const eqToParam = customerIdQC.eq(paramTester("num"));
type typeofEqToParam = typeof eqToParam;
type typeofEqToParamApplied = typeofEqToParam extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type typeofEqToParamAppliedParam = typeofEqToParamApplied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type EqToParamTest = AssertTrue<AssertEqual<typeofEqToParamAppliedParam, number | null>>;
//
const eqToComparable = customerIdQC.eq(empSalaryQC);
//
const eqToLiteral = customerIdQC.eq(literalTester(1));
//
const eqToParamTyped = customerIdQC.eq(paramTester("num").type<number>());
type typeofEqToParamTyped = typeof eqToParamTyped;
type typeofEqToParamTypedApplied = typeofEqToParamTyped extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type typeofEqToParamTypedAppliedParam = typeofEqToParamTypedApplied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type EqToParamTypedTest = AssertTrue<AssertEqual<typeofEqToParamTypedAppliedParam, number>>;
// @ts-expect-error
const eqToInvalidParam = customerIdQC.eq(paramTester("num").type<string>());

//
let var1: 1 | null = 1;
const literalEqToNullableVar = literalTester(1).eq(var1);
//
const literalEqToValue = literalTester(1).eq(1);
//
const literalEqToColumn = literalTester(1).eq(customerIdQC);
//
const literalEqToLiteral = literalTester(1).eq(literalTester(2));
//
const literalEqToParam = literalTester(1).eq(paramTester("num"));
type typeofLiteralEqToParam = typeof literalEqToParam;
type typeofLiteralEqToParamApplied = typeofLiteralEqToParam extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type typeofLiteralEqToParamAppliedParam = typeofLiteralEqToParamApplied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type literalEqToParamTest = AssertTrue<AssertEqual<typeofLiteralEqToParamAppliedParam, number | null>>;
//
const literalEqToParamTyped = literalTester(1).eq(paramTester("num").type<number>());
type typeofLiteralEqToParamTyped = typeof literalEqToParamTyped;
type typeofLiteralEqToParamTypedApplied = typeofLiteralEqToParamTyped extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type typeofLiteralEqToParamTypedAppliedParam = typeofLiteralEqToParamTypedApplied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type LiteralEqToParamTypedTest = AssertTrue<AssertEqual<typeofLiteralEqToParamTypedAppliedParam, number>>;
// @ts-expect-error
const literalEqToInvalidParam = literalTester(1).eq(param("num").type<string>());