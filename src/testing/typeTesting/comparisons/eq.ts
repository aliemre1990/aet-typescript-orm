import { dbTypes, type PgDbType } from "../../../db.js";
import type ColumnComparisonOperation from "../../../query/comparisons/_comparisonOperations.js";
import type QueryParam from "../../../query/param.js";
import QueryColumn from "../../../query/queryColumn.js";
import type { IsAny } from "../../../utility/common.js";
import { customerIdQC, empSalaryQC } from "../../_columns.js";
import { literalTester, paramTester } from "../../_functions.js";
import { customersTable } from "../../_tables.js";
import type { AssertEqual, AssertTrue } from "../_typeTestingUtilities.js";

const eqToValue = customerIdQC.eq(1);
type typeofEqToValue = typeof eqToValue;
type typeofEqToValueApplied = typeofEqToValue extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type EqToValueTest = AssertTrue<AssertEqual<typeofEqToValueApplied, [1 | null]>>;

const eqToParam = customerIdQC.eq(paramTester("num"));
type typeofEqToParam = typeof eqToParam;
type typeofEqToParamApplied = typeofEqToParam extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type EqToParamTest = AssertTrue<AssertEqual<typeofEqToParamApplied, [QueryParam<"postgresql", "num", number | null, any, any>]>>;

const eqToComparable = customerIdQC.eq(empSalaryQC);
type typeofEqToComparable = typeof eqToComparable;
type typeofEqToComparableApplied = typeofEqToComparable extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type eqToComparableTest = AssertTrue<typeofEqToComparableApplied[0] extends QueryColumn<any, any, any, any, any, any, any> ? true : false>;

const eqToLiteral = customerIdQC.eq(literalTester(1));
type typeofEqToLiteral = typeof eqToLiteral;

const eqToParamTyped = customerIdQC.eq(paramTester("num").type<number>());
type typeofEqToParamTyped = typeof eqToParamTyped;
type typeofEqToParamTypedApplied = typeofEqToParamTyped extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type EqToParamTypedTest = AssertTrue<AssertEqual<typeofEqToParamTypedApplied, [QueryParam<"postgresql", "num", number, any, any>]>>;