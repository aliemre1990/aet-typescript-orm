import type { DbValueTypes, PgDbType } from "../../../db.js";
import type ColumnComparisonOperation from "../../../query/comparisons/_comparisonOperations.js";
import type ColumnSQLFunction from "../../../query/functions/_functions.js";
import pgCoalesce from "../../../query/functions/coalesce.js";
import ColumnLogicalOperation, { and } from "../../../query/logicalOperations.js";
import QueryParam, { param } from "../../../query/param.js";
import QueryColumn from "../../../query/queryColumn.js";
import { customersTable, employeesTable, ordersTable, usersTable } from "../_tables.js";
import type { AssertEqual, AssertTrue } from "../_typeTestingUtilities.js";

/**
 * 
 */
const pgCoalescePlainWithParam = pgCoalesce(1, 2, param("param"));

type pgCoalescePlainWithParamType = typeof pgCoalescePlainWithParam;
type pgCoalescePlainWithParamArgs = pgCoalescePlainWithParamType extends ColumnSQLFunction<any, any, infer TArgs, any> ? TArgs : never;
type pgCoalescePlainWithParamArg0 = pgCoalescePlainWithParamArgs[0];
type pgCoalescePlainWithParamArg1 = pgCoalescePlainWithParamArgs[1];
type pgCoalescePlainWithParamArg2 = pgCoalescePlainWithParamArgs[2];
type pgCoalescePlainWithParamReturnType = pgCoalescePlainWithParamType extends ColumnSQLFunction<any, any, any, infer TRet> ? TRet : never;

type pgCoalescePlainWithParamLengthTest = AssertTrue<AssertEqual<3, pgCoalescePlainWithParamArgs["length"]>>;
type pgCoalescePlainWithParamReturnTypeTest = AssertTrue<AssertEqual<number, pgCoalescePlainWithParamReturnType>>
type pgCoalescePlainWithParamArg0Test = AssertTrue<AssertEqual<number, pgCoalescePlainWithParamArg0>>;
type pgCoalescePlainWithParamArg1Test = AssertTrue<AssertEqual<number, pgCoalescePlainWithParamArg1>>;
type pgCoalescePlainWithParamArg2Test = AssertTrue<AssertEqual<QueryParam<PgDbType, "param", number | null>, pgCoalescePlainWithParamArg2>>;

/**
 * 
 */
const customerIdQC = new QueryColumn(customersTable.columns.customerId);
const createdByQC = new QueryColumn(customersTable.columns.createdBy);
const customerNameQC = new QueryColumn(customersTable.columns.name);
const empSalaryQC = new QueryColumn(employeesTable.columns.salary);

// @ts-expect-error
pgCoalesce(customerIdQC, customerNameQC);

// @ts-expect-error
pgCoalesce(customerIdQC, "error");

const nonNullCoalesce = pgCoalesce(customerIdQC, 2);

const nullCoalesce = pgCoalesce(empSalaryQC);
type NullCoalesce = typeof nullCoalesce;
type NullCoalesceRetType = NullCoalesce extends ColumnSQLFunction<any, any, any, infer TRet> ? TRet : never;
type NullCoalesceTest = AssertTrue<AssertEqual<number | null, NullCoalesceRetType>>

// @ts-expect-error
pgCoalesce(customerNameQC).eq(1);

pgCoalesce(customerIdQC).eq(1);

pgCoalesce(customerIdQC).eq(createdByQC);

/**
 * 
 */
const InferParamsFromCoalesce = customersTable
    .join('INNER', usersTable, (cols) => {

        const res1 = pgCoalesce(
            1, 2, param("param1"), pgCoalesce(1, 2, 3, param("param2"), pgCoalesce(1, 2, 3, 4, param("param3")))
        ).eq(param("param4"));

        type tp = typeof res1;
        type tp1 = tp extends ColumnComparisonOperation<any, any, any, infer TP> ? TP : never;

        return res1;
    })
    .join('INNER', usersTable.as('parentUsers'), (cols) => {
        const res = and(
            pgCoalesce("asdf", param("coalesceAnd1")).eq("sadf"),
            pgCoalesce(new Date(), param("coalesceAnd2")).eq(new Date())
        );

        return res;
    })
    .join('INNER', ordersTable, (cols) => cols.users.userName.eq(cols.customers.name))
    .select()
    .exec;

type InferParamsFromCoalesceResult = typeof InferParamsFromCoalesce;
type InferParamsFromCoalesceParams = InferParamsFromCoalesceResult extends (params: infer TParam) => any ? TParam : never;
type InferParamsFromCoalesceParamsResult = {
    param3: number | null;
    param2: number | null;
    param1: number | null;
    param4: number | null;
    coalesceAnd1: string | null;
    coalesceAnd2: Date | null;
} | undefined;

type InferParamsFromCoalesceTest = AssertTrue<AssertEqual<InferParamsFromCoalesceParamsResult, InferParamsFromCoalesceParams>>