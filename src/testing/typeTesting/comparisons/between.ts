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
const betweenInvalidLRParam = customerIdQC.between(paramTester("left").type<string>(), paramTester("right"));
// @ts-expect-error
const betweenInvalidLRParam = customerIdQC.between(paramTester("left")(), paramTester("right").type<string>());
//
const betweenLRParamLTyped = customerIdQC.between(paramTester("left").type<number>(), paramTester("right"));
type typeofBetweenLRParamLTyped = typeof betweenLRParamLTyped;
type typeofBetweenLRParamLTypedApplied = typeofBetweenLRParamLTyped extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type betweenLRParamLTypedLParamType = typeofBetweenLRParamLTypedApplied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLRParamLTypedRParamType = typeofBetweenLRParamLTypedApplied[1] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLRParamLTypedLParamTest = AssertTrue<AssertEqual<betweenLRParamLTypedLParamType, number>>;
type betweenLRParamLTypedRParamTest = AssertTrue<AssertEqual<betweenLRParamLTypedRParamType, number | null>>;
//
const betweenLRParamRTyped = customerIdQC.between(paramTester("left"), paramTester("right").type<number>());
type typeofBetweenLRParamRTyped = typeof betweenLRParamRTyped;
type typeofBetweenLRParamRTypedApplied = typeofBetweenLRParamRTyped extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type betweenLRParamRTypedLParamType = typeofBetweenLRParamRTypedApplied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLRParamRTypedRParamType = typeofBetweenLRParamRTypedApplied[1] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLRParamRTypedLParamTest = AssertTrue<AssertEqual<betweenLRParamRTypedLParamType, number | null>>;
type betweenLRParamRTypedRParamTest = AssertTrue<AssertEqual<betweenLRParamRTypedRParamType, number>>;
// @ts-expect-error
const betweenLRParamInvalidL = customerIdQC.between(paramTester("left").type<string>(), 1);
// @ts-expect-error
const betweenLRParamInvalidR = customerIdQC.between(1, paramTester("right").type<string>());
// @ts-expect-error
const betweenLInvalidParamRCol = customerIdQC.between(paramTester("left").type<string>(), empSalaryQC);
// @ts-expect-error
const betweenLColRInvalidParam = customerIdQC.between(empSalaryQC, paramTester("left").type<string>());
//
const betweenLColRParam = customerIdQC.between(empSalaryQC, paramTester("right"));
type typeofBetweenLColRParam = typeof betweenLColRParam;
type typeofBetweenLColRParamApplied = typeofBetweenLColRParam extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type betweenLColRParamParamType = typeofBetweenLColRParamApplied[1] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLColRParamTest = AssertTrue<AssertEqual<betweenLColRParamParamType, number | null>>;
//
const betweenLColRParamTyped = customerIdQC.between(empSalaryQC, paramTester("right").type<number>());
type typeofBetweenLColRParamTyped = typeof betweenLColRParamTyped;
type typeofBetweenLColRParamTypedApplied = typeofBetweenLColRParamTyped extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type betweenLColRParamTypedParamType = typeofBetweenLColRParamTypedApplied[1] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLColRParamTypedTest = AssertTrue<AssertEqual<betweenLColRParamTypedParamType, number>>;
//
const betweenLParamRCol = customerIdQC.between(paramTester("num"), empSalaryQC);
type typeofBetweenLParamRCol = typeof betweenLParamRCol;
type typeofBetweenLParamRColApplied = typeofBetweenLParamRCol extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type betweenLParamRColParamType = typeofBetweenLParamRColApplied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLParamRColTest = AssertTrue<AssertEqual<betweenLParamRColParamType, number | null>>;
//
const betweenLParamTypedRCol = customerIdQC.between(paramTester("num").type<number>(), empSalaryQC);
type typeofBetweenLParamTypedRCol = typeof betweenLParamTypedRCol;
type typeofBetweenLParamTypedRColApplied = typeofBetweenLParamTypedRCol extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type betweenLParamTypedRColParamType = typeofBetweenLParamTypedRColApplied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLParamTypedRColTest = AssertTrue<AssertEqual<betweenLParamTypedRColParamType, number>>;
//
const betweenLParamRVal = customerIdQC.between(paramTester("left"), 1);
type typeofBetweenLParamRVal = typeof betweenLParamRVal;
type typeofBetweenLParamRValApplied = typeofBetweenLParamRVal extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type betweenLParamRValParamType = typeofBetweenLParamRValApplied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLParamRValTest = AssertTrue<AssertEqual<betweenLParamRValParamType, number | null>>;
//
const betweenLParamTypedRVal = customerIdQC.between(paramTester("left").type<number>(), 1);
type typeofBetweenLParamTypedRVal = typeof betweenLParamTypedRVal;
type typeofBetweenLParamTypedRValApplied = typeofBetweenLParamTypedRVal extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type betweenLParamTypedRValParamType = typeofBetweenLParamTypedRValApplied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLParamTypedRValTest = AssertTrue<AssertEqual<betweenLParamTypedRValParamType, number>>;
//
const betweenLValRParam = customerIdQC.between(1, paramTester("right"));
type typeofBetweenLValRParam = typeof betweenLValRParam;
type typeofBetweenLValRParamApplied = typeofBetweenLValRParam extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type betweenLValRParamParamType = typeofBetweenLValRParamApplied[1] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLValRParamTest = AssertTrue<AssertEqual<betweenLValRParamParamType, number | null>>;
//
const betweenLValRParamTyped = customerIdQC.between(1, paramTester("right").type<number>());
type typeofBetweenLValRParamTyped = typeof betweenLValRParamTyped;
type typeofBetweenLValRParamTypedApplied = typeofBetweenLValRParamTyped extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type betweenLValRParamTypedParamType = typeofBetweenLValRParamTypedApplied[1] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLValRParamTypedTest = AssertTrue<AssertEqual<betweenLValRParamTypedParamType, number>>;
//
const betweenLQueryRQuery = customerIdQC.between(customersTable.select((tables) => [tables.customers.id]), customersTable.select((tables) => [tables.customers.id]));
// 
const betweenLQueryRVal = customerIdQC.between(customersTable.select((tables) => [tables.customers.id]), 1);
//
const betweenLValRQuery = customerIdQC.between(1, customersTable.select((tables) => [tables.customers.id]));
// @ts-expect-error
const betweenLInvalidQueryRVal = customerIdQC.between(customersTable.select((tables) => [tables.customers.name]), 1);
// @ts-expect-error
const betweenLValRInvalidQuery = customerIdQC.between(1, customersTable.select((tables) => [tables.customers.name]));
