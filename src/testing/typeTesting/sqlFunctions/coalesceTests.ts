import { dbTypes, type PgDbType } from "../../../db.js";
import type { IComparable } from "../../../query/_interfaces/IComparable.js";
import type { InferParamsFromOps } from "../../../query/_types/paramAccumulationComparison.js";
import type ColumnComparisonOperation from "../../../query/comparisons/_comparisonOperations.js";
import type ColumnSQLFunction from "../../../query/functions/_functions.js";
import { generateCoalesceFn } from "../../../query/functions/coalesce.js";
import QueryParam, { generateParamFn } from "../../../query/param.js";
import QueryColumn from "../../../query/queryColumn.js";
import { customersTable, employeesTable, ordersTable, usersTable } from "../_tables.js";
import type { AssertEqual, AssertTrue } from "../_typeTestingUtilities.js";

const customerIdQC = new QueryColumn<PgDbType, typeof customersTable.columns.id, NonNullable<typeof customersTable.columns.id.tableSpecs>, undefined>(dbTypes.postgresql, customersTable.columns.id);
const createdByQC = new QueryColumn<PgDbType, typeof customersTable.columns.createdBy, NonNullable<typeof customersTable.columns.createdBy.tableSpecs>, undefined>(dbTypes.postgresql, customersTable.columns.createdBy);
const customerNameQC = new QueryColumn<PgDbType, typeof customersTable.columns.name, NonNullable<typeof customersTable.columns.name.tableSpecs>, undefined>(dbTypes.postgresql, customersTable.columns.name);
const empSalaryQC = new QueryColumn<PgDbType, typeof employeesTable.columns.salary, NonNullable<typeof employeesTable.columns.salary.tableSpecs>, undefined>(dbTypes.postgresql, employeesTable.columns.salary);


const coalesce = generateCoalesceFn("postgresql");
const param = generateParamFn("postgresql");

/**
 * Coalesce with params tests
 */
coalesce(param("param1").type<number | null>(), param("param2"));
coalesce(param("param1").type<number | null>(), param("param2").type<number>());
// @ts-expect-error
coalesce(param("param1").type<number | null>(), param("param2").type<string>());
// @ts-expect-error
coalesce(customerIdQC, param("param1").type<string>());


const CoalesceWithTypedParams = customersTable
    .select((cols, { coalesce, param }) => {

        const coalesceResult = coalesce(param("param1").type<number>(), param("param2").type<number | null>(), param("param3"));
        type coalesceId = typeof coalesceResult extends IComparable<any, infer TId, any, any, any, any, any, any> ? TId : never;

        return [
            coalesce(param("param1").type<number>(), param("param2").type<number | null>(), param("param3")).as("coalesceResult")
        ]
    }
    ).exec;
type CoalesceWithTypedParamsReturnType = ReturnType<typeof CoalesceWithTypedParams>;
type CoalesceWithTypedParamsResult = { coalesceResult: number }[];
type CoalesceWithTypedParamsTest = AssertTrue<AssertEqual<CoalesceWithTypedParamsResult, CoalesceWithTypedParamsReturnType>>;

type CoalesceWithTypedParamsParams = typeof CoalesceWithTypedParams extends (param: infer TParam) => any ? TParam : never;
type CoalesceWithTypeParamsParamsResult = { param1: number, param2: number | null, param3: number | null };
type CoalesceWithTypedParamsParamsTest = AssertTrue<AssertEqual<CoalesceWithTypedParamsParams, CoalesceWithTypeParamsParamsResult>>


/**
 * 
 */
const pgCoalescePlainWithParam = coalesce(1, 2, param("param"));

type pgCoalescePlainWithParamType = typeof pgCoalescePlainWithParam;
type pgCoalescePlainWithParamArgs = pgCoalescePlainWithParamType extends ColumnSQLFunction<any, any, infer TArgs, any, any, any, any, any> ? TArgs : never;
type pgCoalescePlainWithParamArg0 = pgCoalescePlainWithParamArgs[0];
type pgCoalescePlainWithParamArg1 = pgCoalescePlainWithParamArgs[1];
type pgCoalescePlainWithParamArg2 = pgCoalescePlainWithParamArgs[2];
type pgCoalescePlainWithParamReturnType = pgCoalescePlainWithParamType extends ColumnSQLFunction<any, any, any, infer TRet, any, any, any, any> ? TRet : never;

type pgCoalescePlainWithParamLengthTest = AssertTrue<AssertEqual<3, pgCoalescePlainWithParamArgs["length"]>>;
type pgCoalescePlainWithParamReturnTypeTest = AssertTrue<AssertEqual<number, pgCoalescePlainWithParamReturnType>>
type pgCoalescePlainWithParamArg0Test = AssertTrue<AssertEqual<number, pgCoalescePlainWithParamArg0>>;
type pgCoalescePlainWithParamArg1Test = AssertTrue<AssertEqual<number, pgCoalescePlainWithParamArg1>>;
type pgCoalescePlainWithParamArg2Test = AssertTrue<AssertEqual<QueryParam<PgDbType, "param", number | null, any, any>, pgCoalescePlainWithParamArg2>>;

/**
 * Misc
 */
// @ts-expect-error
coalesce(customerIdQC, customerNameQC);

// @ts-expect-error
coalesce(customerIdQC, "error");

const nonNullCoalesce = coalesce(customerIdQC, 2);

const nullCoalesce = coalesce(empSalaryQC);
type NullCoalesce = typeof nullCoalesce;
type NullCoalesceRetType = NullCoalesce extends ColumnSQLFunction<any, any, any, infer TRet, any, any, any, any> ? TRet : never;
type NullCoalesceTest = AssertTrue<AssertEqual<number | null, NullCoalesceRetType>>

// @ts-expect-error
coalesce(customerNameQC).eq(1);

coalesce(customerIdQC).eq(1);

coalesce(customerIdQC).eq(createdByQC);

/**
 * 
 */
const InferParamsFromCoalesce = customersTable
    .join('INNER', usersTable, (cols, { coalesce }) => {

        const res1 = coalesce(
            1, 2, param("param1"), coalesce(1, 2, 3, param("param2"), coalesce(1, 2, 3, 4, param("param3")))
        ).eq(param("param4"));

        type tp = typeof res1;
        type tp1 = tp extends ColumnComparisonOperation<any, any, any, infer TP> ? TP : never;

        return res1;
    })
    .join('INNER', usersTable.as('parentUsers'), (cols, { and, coalesce }) => {
        const res = and(
            coalesce("asdf", param("coalesceAnd1")).eq("sadf"),
            coalesce(new Date(), param("coalesceAnd2")).eq(new Date())
        );

        return res;
    })
    .join('INNER', ordersTable, (cols) => cols.users.userName.eq(cols.customers.name))
    .select(cols => [cols.customers.id])
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
};
type InferParamsFromCoalesceTest = AssertTrue<AssertEqual<InferParamsFromCoalesceParamsResult, InferParamsFromCoalesceParams>>;

/**
 * 
 */
coalesce(empSalaryQC, 100).between(100, 200);
coalesce(empSalaryQC, 100).between(100, null);
coalesce(empSalaryQC, null).between(500, null);
// @ts-expect-error
coalesce(customerNameQC, "ali").between(100, 500);
coalesce(customerNameQC, "ali").between(coalesce("adsf"), coalesce("asdfxcv", null));

/**
 * 
 */
const betweenCoalesceParamed = coalesce(customerNameQC, "ali").between(param("betLeft"), coalesce("asdf", param("betRight")));

type typeofBetweenCoalesceParamed = typeof betweenCoalesceParamed;
type betweenCoalesceParamedParams = InferParamsFromOps<typeofBetweenCoalesceParamed>;

type betweenCoalesceParamedParamLengthTest = AssertTrue<AssertEqual<2, betweenCoalesceParamedParams["length"]>>;

type betweenCoalesceParamedFirstParamRes = QueryParam<PgDbType, "betLeft", string | null, any, any>;
type betweenCoalesceParamedFirstParamTest = AssertTrue<AssertEqual<betweenCoalesceParamedFirstParamRes, betweenCoalesceParamedParams[0]>>;

type betweenCoalesceParamedSecondParamRes = QueryParam<PgDbType, "betRight", string | null, any, any>;
type betweenCoalesceParamedSecondParamTest = AssertTrue<AssertEqual<betweenCoalesceParamedSecondParamRes, betweenCoalesceParamedParams[1]>>;

