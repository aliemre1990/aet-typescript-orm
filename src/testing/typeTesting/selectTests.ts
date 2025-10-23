import type { PgDbType } from "../../db.js";
import type { AccumulateSubQueryParams } from "../../query/_types/subQueryUtility.js";
import QueryBuilder, { from } from "../../query/queryBuilder.js";
import { customersTable, employeesTable, ordersTable, shipmentsTable, usersTable } from "./_tables.js";
import type { AssertEqual, AssertTrue } from "./_typeTestingUtilities.js";


/**
 * 
 */
const SingleTableAutoSelectWhereWithParamQuery = customersTable
    .where((cols, { param }) => cols.customers.id.eq(param("whereparam")))
    .select(cols => [cols.customers.id, cols.customers.name, cols.customers.createdBy])
    .exec;

type SingleTableAutoSelectWhereWithParamQueryResult = { id: number, name: string, createdBy: number }[];
type SingleTableAutoSelectWhereWithParamQueryReturnType = ReturnType<typeof SingleTableAutoSelectWhereWithParamQuery>;
type SingleTableAutoSelectWhereWithParamQueryTest = AssertTrue<AssertEqual<SingleTableAutoSelectWhereWithParamQueryResult, SingleTableAutoSelectWhereWithParamQueryReturnType>>

/**
 * 
 */
const SingleQueryTableAutoSelectQuery = customersTable.as("cst").select(cols => [cols.cst.id, cols.cst.name, cols.cst.createdBy]).exec;

type tp = ReturnType<typeof SingleQueryTableAutoSelectQuery>

type SingleQueryTableAutoSelectQueryResult = { id: number, name: string, createdBy: number }[];
type SingleQueryTableAutoSelectQueryReturnType = ReturnType<typeof SingleQueryTableAutoSelectQuery>
type SingleQueryTableAutoSelectQueryTest = AssertTrue<AssertEqual<SingleQueryTableAutoSelectQueryResult, SingleQueryTableAutoSelectQueryReturnType>>

/**
 * 
 */
const QueryTableJoinQuery = customersTable.as("cst")
    .join("INNER", () => usersTable, (cols) => cols.users.id.eq(cols.cst.createdBy))
    .select(cols => ([
        cols.users.id.as("userId"),
        cols.users.userName,
        cols.users.createdAt.as("userCreatedAt"),
        cols.cst.id.as("cstId"),
        cols.cst.name.as("cstName"),
        cols.cst.createdBy.as("cstCreatedBy")
    ]))
    .exec;

type QueryTableJoinQueryResult = { userId: number, userName: string, userCreatedAt: Date, cstId: number, cstName: string, cstCreatedBy: number }[];
type QueryTableJoinQueryReturnType = ReturnType<typeof QueryTableJoinQuery>;
type QueryTableJoinQueryTest = AssertTrue<AssertEqual<QueryTableJoinQueryResult, QueryTableJoinQueryReturnType>>

/**
 * 
 */
const SingleTableAutoSelectQuery = customersTable.select(cols => [cols.customers.id, cols.customers.name, cols.customers.createdBy]).exec;

type SingleTableAutoSelectQueryResult = { id: number; name: string; createdBy: number; }[];
type SingleTableAutoSelectQueryReturnType = ReturnType<typeof SingleTableAutoSelectQuery>
type SingleTableAutoSelectQueryTest = AssertTrue<AssertEqual<SingleTableAutoSelectQueryResult, SingleTableAutoSelectQueryReturnType>>;

/**
 * 
 */
const SingleTableJoinWithAutoSelectQuery = customersTable
    .join('INNER', () => usersTable, (cols, { param }) => cols.users.id.eq(param("param1")))
    .select(cols => [
        cols.customers.id.as("customerId"),
        cols.customers.name.as("customerName"),
        cols.customers.createdBy.as("customerCreatedBy"),
        cols.users.id.as("userId"),
        cols.users.userName,
        cols.users.createdAt.as("userCreatedAt")
    ])
    .exec;

type SingleTableJoinWithAutoSelectQueryResult = {
    customerId: number;
    customerName: string;
    customerCreatedBy: number;
    userId: number;
    userName: string;
    userCreatedAt: Date;
}[];
type SingleTableJoinWithAutoSelectQueryReturnType = ReturnType<typeof SingleTableJoinWithAutoSelectQuery>;
type SingleTableJoinWithAutoSelectQueryTest = AssertTrue<AssertEqual<SingleTableJoinWithAutoSelectQueryResult, SingleTableJoinWithAutoSelectQueryReturnType>>

/**
 * 
 */
const AutoSelectMultiJoins = customersTable
    .join('INNER', usersTable, (cols, { and, param }) => {

        const res1 = and(
            cols.users.id.eq(param("userParam1").type<number>()),
            cols.users.id.eq(param("userParam2")),
            cols.users.userName.eq(param("userParam3")),
            cols.users.id.between(param("userBetweenLeft"), param("userBetweenRight")),
            and(
                cols.users.id.eq(cols.customers.createdBy),
                cols.customers.name.eq(param("userGteParam4")),
                and(cols.users.id.eq(param("userEqParam1"))),
                cols.users.id.sqlIn([param("inParam")])
            )
        );

        return res1;

        // const inres = cols.users.id.sqlIn(1, cols.customers.id, 2, cols.users.id, cols.customers.id);
        // type inrest = typeof inres extends ColumnComparisonOperation<any, any, any, infer TCols, any> ? TCols : never;
        // type prm = inrest[1];
    })
    .join('INNER', usersTable.as('parentUsers'), (cols, { and, coalesce, param }) => {

        const comp = and(
            cols.parentUsers.id.eq(cols.customers.id),
            cols.parentUsers.id.eq(param("parentUserEq1")),
            cols.parentUsers.id.between(param("parentUserBetLeft"), cols.customers.id),
            cols.parentUsers.id.eq(coalesce(param("parentUserGt2"), 1, 2, coalesce(1, 2, param("innerCoalesce")))),
            cols.parentUsers.userName.eq(param("parentUserNeq3")),
            cols.parentUsers.userName.between(cols.customers.name, cols.users.userName),
            and(cols.customers.createdBy.eq(235), cols.parentUsers.userName.eq(param("innerParentUserParam1")))
        );

        return comp;
    })
    .join('INNER', ordersTable, (cols) => cols.users.userName.eq(cols.customers.name))
    .select(cols => [
        cols.customers.id.as("customerId"),
        cols.customers.name.as("customerName"),
        cols.customers.createdBy.as("customerCreatedBy"),
        cols.users.id.as("userId"),
        cols.users.userName.as("userUserName"),
        cols.users.createdAt.as("userCreatedAt"),
        cols.parentUsers.id.as("parentUserId"),
        cols.parentUsers.userName.as("parentUserUserName"),
        cols.parentUsers.createdAt.as("parentUserCreatedAt"),
        cols.orders.id.as("orderId"),
        cols.orders.customerId.as("orderCustomerId"),
        cols.orders.createdBy.as("orderCreatedBy")
    ])
    .exec;



type AutoSelectMultiJoinsResult = {
    customerId: number;
    customerName: string;
    customerCreatedBy: number;
    userId: number;
    userUserName: string;
    userCreatedAt: Date;
    parentUserId: number;
    parentUserUserName: string;
    parentUserCreatedAt: Date;
    orderId: number;
    orderCustomerId: number;
    orderCreatedBy: number;
}[]
type AutoSelectMultiJoinsReturnType = ReturnType<typeof AutoSelectMultiJoins>
type AutoSelectMultiJoinsTest = AssertTrue<AssertEqual<AutoSelectMultiJoinsResult, AutoSelectMultiJoinsReturnType>>;

type AutoSelectMultiJoinsParamsResult = {
    userParam1: number;
    userParam2: number | null;
    userParam3: string | null;
    userBetweenLeft: number | null;
    userBetweenRight: number | null;
    userGteParam4: string | null;
    userEqParam1: number | null;
    inParam: number | null;
    parentUserEq1: number | null;
    parentUserBetLeft: number | null;
    parentUserGt2: number | null; //
    innerCoalesce: number | null; //
    parentUserNeq3: string | null;
    innerParentUserParam1: string | null;
};
type AutoSelectMultiJoinsParamsType = typeof AutoSelectMultiJoins extends (param: infer TParams) => any ? TParams : never;
type AutoSelectMultiJoinsParamsText = AssertTrue<AssertEqual<AutoSelectMultiJoinsParamsResult, AutoSelectMultiJoinsParamsType>>

/**
 * 
 */
const SingleLevelSelectWithJoins = customersTable
    .join('INNER', () => usersTable, (cols) => {
        type t = typeof cols;

        return cols.users.id.eq(1);
    })
    .join('INNER', () => ordersTable, (cols) => {
        type t = typeof cols;

        return cols.orders.id.eq(1);

    })
    .join('INNER', () => shipmentsTable, (cols) => {
        type t = typeof cols;

        return cols.shipments.orderId.eq(1);
    })
    .select((cols, { round, param }) => [
        cols.customers.id,
        cols.orders.customerId.as("orderCustomerId"),
        cols.customers.name.as("customerName")
    ])
    .exec;
type SingleLevelSelectWithJoinsResult = { id: number, orderCustomerId: number, customerName: string }[];
type SingleLevelSelectWithJoinsTest = AssertTrue<AssertEqual<SingleLevelSelectWithJoinsResult, ReturnType<typeof SingleLevelSelectWithJoins>>>;

type SingleLevelSelectWithJoinsParams = typeof SingleLevelSelectWithJoins extends (...params: infer TParams) => any ? TParams : never;
type SingleLevelSelectWithJoinsParamsTest = AssertTrue<AssertEqual<[] | [{ [key: string]: any }], SingleLevelSelectWithJoinsParams>>;
/**
 * 
 */
const MultiLevelSelectWithJoins = customersTable
    .join('INNER', () => usersTable, (cols) => cols.users.id.eq(1))
    .join('INNER', () => usersTable.as("parentUsers"), (cols) => cols.parentUsers.id.eq(1))
    .select((cols, { jsonBuildObject, round, param }) => [
        cols.customers.id.as("customerId"),
        round(cols.customers.id, param("roundParam")).as("roundResult"),
        cols.users.userName,
        jsonBuildObject({ parentUserId: cols.parentUsers.id, customers: jsonBuildObject(cols.customers) }).as("subProp")
    ])
    .exec;
type multiLevelSelectWithJoinsExpectedResult = {
    customerId: number,
    userName: string,
    roundResult: number | null
    subProp: {
        parentUserId: number,
        customers: {
            id: number,
            name: string,
            createdBy: number
        }
    }
}[];
type multiLevelSelectWithJoinsResult = ReturnType<typeof MultiLevelSelectWithJoins>
type MultiLevelSelectWithJoinsTest = AssertTrue<AssertEqual<multiLevelSelectWithJoinsExpectedResult, multiLevelSelectWithJoinsResult>>
