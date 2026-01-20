import type SQLCaseExpression from "../../../query/caseExpression.js";
import type QueryParam from "../../../query/param.js";
import { caseTester, paramTester } from "../../_functions.js";
import { customersTable } from "../../_tables.js";
import type { AssertEqual, AssertTrue } from "../_typeTestingUtilities.js";

const caseWithParamOnMainExpression = caseTester(customersTable.select().where((tables, { param }) => tables.customers.id.eq(param("eq"))));
type typeofCaseWithParamOnMainExpression = typeof caseWithParamOnMainExpression;
type caseWithParamOnMainExpressionParams = typeofCaseWithParamOnMainExpression extends SQLCaseExpression<any, never, any, infer TParams, any, any> ? TParams : never;
type caseWithParamOnMainExpressionParam1Type = caseWithParamOnMainExpressionParams[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type caseWithParamOnMainExpressionTest = AssertTrue<AssertEqual<caseWithParamOnMainExpressionParam1Type, number | null>>;