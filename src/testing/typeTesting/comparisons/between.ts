import type ColumnComparisonOperation from "../../../query/comparisons/_comparisonOperations.js";
import type QueryParam from "../../../query/param.js";
import { customerIdQC, empSalaryQC } from "../../_columns.js";
import { literalTester, paramTester } from "../../_functions.js";
import { customersTable, employeesTable } from "../../_tables.js";
import type { AssertEqual, AssertTrue } from "../_typeTestingUtilities.js";

//
const betweenVal = customerIdQC.between(1, 2);
// @ts-expect-error
const betweenInvalidVal1 = customerIdQC.between(1, "ali");
// @ts-expect-error
const betweenInvalidVal2 = customerIdQC.between("ali", 1);
// @ts-expect-error
const betweenInvalidVal3 = customerIdQC.between("ali", "veli");
//
const betweenLRParam = customerIdQC.between(paramTester("left"), paramTester("right"));
type typeofBetweenLRParam = typeof betweenLRParam;
type typeofBetweenLRParamApplied = typeofBetweenLRParam extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type betweenLRParamLParamType = typeofBetweenLRParamApplied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLRParamRParamType = typeofBetweenLRParamApplied[1] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLRParamLParamTest = AssertTrue<AssertEqual<betweenLRParamLParamType, number | null>>;
type betweenLRParamRParamTest = AssertTrue<AssertEqual<betweenLRParamRParamType, number | null>>;
// @ts-expect-error
const betweenInvalidLRParam = customerIdQC.between(paramTester("left").type<string>(), paramTester("right").type<string>());
//
const betweenLRParamLTyped = customerIdQC.between(paramTester("left").type<number>(), paramTester("right"));
type typeofBetweenLRParamLTyped = typeof betweenLRParamLTyped;
type typeofBetweenLRParamLTypedApplied = typeofBetweenLRParamLTyped extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type betweenLRParamLTypedLParamType = typeofBetweenLRParamLTypedApplied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLRParamLTypedRParamType = typeofBetweenLRParamLTypedApplied[1] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLRParamLTypedLParamTest = AssertTrue<AssertEqual<betweenLRParamLTypedLParamType, number>>;
type betweenLRParamLTypedRParamTest = AssertTrue<AssertEqual<betweenLRParamLTypedRParamType, number | null>>;
// @ts-expect-error
const betweenLRParamInvalidL = customerIdQC.between(paramTester("left").type<string>(), 1);
// @ts-expect-error
const betweenLRParamInvalidR = customerIdQC.between(1, paramTester("right").type<string>());
// @ts-expect-error
const betweenLInvalidParamRCol = customerIdQC.between(paramTester("left").type<string>(), empSalaryQC);
// @ts-expect-error
const betweenLColRInvalidParam = customerIdQC.between(empSalaryQC, paramTester("left").type<string>());

