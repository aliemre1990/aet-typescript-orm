import type ColumnComparisonOperation from "../../../query/comparisons/_comparisonOperations.js";
import type QueryParam from "../../../query/param.js";
import { customerIdQC } from "../../_columns.js";
import { literalTester, paramTester } from "../../_functions.js";
import { customersTable, employeesTable } from "../../_tables.js";
import type { AssertEqual, AssertTrue } from "../_typeTestingUtilities.js";

//
const inVal = customerIdQC.sqlIn(1, 2, 3);
// @ts-expect-error
const inInvalidVal = customerIdQC.sqlIn("ali", 1);
//
const inQb = customerIdQC.sqlIn(customersTable.select((tables) => [tables.customers.id]));
//
const InNonNullableQb = customerIdQC.sqlIn(employeesTable.select((tables) => [tables.employees.salary]));
// @ts-expect-error
const inInvalidQb = customerIdQC.sqlIn(customersTable.select((tables) => [tables.customers.name]));
//
const inParam = customerIdQC.sqlIn(paramTester("num1"), paramTester("num2").type<number>(), paramTester("num3").type<number | null>());
type typeofInParam = typeof inParam;
type typeofInParamApplied = typeofInParam extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type typeofInParamParam1 = typeofInParamApplied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type typeofInParamParam2 = typeofInParamApplied[1] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type typeofInParamParam3 = typeofInParamApplied[2] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type InParamParam1Test = AssertTrue<AssertEqual<typeofInParamParam1, number | null>>;
type InParamParam2Test = AssertTrue<AssertEqual<typeofInParamParam2, number>>;
type InParamParam3Test = AssertTrue<AssertEqual<typeofInParamParam3, number | null>>;
// @ts-expect-error
const inInvalidParam = customerIdQC.sqlIn(paramTester("num").type<string>());

//
const literalInVal = literalTester(1).sqlIn(1, 2, 3)
//
const literalInQb = literalTester(1).sqlIn(customersTable.select((tables) => [tables.customers.id]));
// @ts-expect-error
const literalInInvalidQb = literalTester(1).sqlIn(customersTable.select((tables) => [tables.customers.name]));

