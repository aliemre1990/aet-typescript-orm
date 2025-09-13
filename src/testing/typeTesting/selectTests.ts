import { customersTable, ordersTable, shipmentsTable, usersTable } from "./_tables.js";
import type { AssertEqual, AssertTrue } from "./_typeTestingUtilities.js";

/**
 * 
 */
const SingleTableAutoSelectWhereWithParamQuery = customersTable
    .where((cols, { param }) => cols.customers.id.eq(param("whereparam")))
    .select(cols => cols.customers)
    .exec;

type SingleTableAutoSelectWhereWithParamQueryResult = { id: number, name: string, createdBy: number };
type SingleTableAutoSelectWhereWithParamQueryReturnType = ReturnType<typeof SingleTableAutoSelectWhereWithParamQuery>;
type SingleTableAutoSelectWhereWithParamQueryTest = AssertTrue<AssertEqual<SingleTableAutoSelectWhereWithParamQueryResult, SingleTableAutoSelectWhereWithParamQueryReturnType>>

/**
 * 
 */
const SingleQueryTableAutoSelectQuery = customersTable.as("cst").select(cols => cols.cst).exec;

type SingleQueryTableAutoSelectQueryResult = { id: number, name: string, createdBy: number };
type SingleQueryTableAutoSelectQueryReturnType = ReturnType<typeof SingleQueryTableAutoSelectQuery>
type SingleQueryTableAutoSelectQueryTest = AssertTrue<AssertEqual<SingleQueryTableAutoSelectQueryResult, SingleQueryTableAutoSelectQueryReturnType>>

/**
 * 
 */
const QueryTableJoinQuery = customersTable.as("cst")
    .join("INNER", usersTable, (cols) => cols.users.id.eq(cols.cst.createdBy))
    .select(cols => ({ userId: cols.users.id, userName: cols.users.userName, userCreatedAt: cols.users.createdAt, cstId: cols.cst.id, cstName: cols.cst.name, cstCreatedBy: cols.cst.createdBy }))
    .exec;

type QueryTableJoinQueryResult = { userId: number, userName: string, userCreatedAt: Date, cstId: number, cstName: string, cstCreatedBy: number };
type QueryTableJoinQueryReturnType = ReturnType<typeof QueryTableJoinQuery>;
type QueryTableJoinQueryTest = AssertTrue<AssertEqual<QueryTableJoinQueryResult, QueryTableJoinQueryReturnType>>

/**
 * 
 */
const SingleTableAutoSelectQuery = customersTable.select(cols => cols.customers).exec;

type SingleTableAutoSelectQueryResult = { id: number; name: string; createdBy: number; };
type SingleTableAutoSelectQueryReturnType = ReturnType<typeof SingleTableAutoSelectQuery>
type SingleTableAutoSelectQueryTest = AssertTrue<AssertEqual<SingleTableAutoSelectQueryResult, SingleTableAutoSelectQueryReturnType>>;

/**
 * 
 */
const SingleTableJoinWithAutoSelectQuery = customersTable
    .join('INNER', usersTable, (cols, { param }) => cols.users.id.eq(param("param1")))
    .select(cols => ({ customerId: cols.customers.id, customerName: cols.customers.name, customerCreatedBy: cols.customers.createdBy, userId: cols.users.id, userName: cols.users.userName, userCreatedAt: cols.users.createdAt }))
    .exec;

type SingleTableJoinWithAutoSelectQueryResult = {
    customerId: number;
    customerName: string;
    customerCreatedBy: number;
    userId: number;
    userName: string;
    userCreatedAt: Date;
};
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
                cols.users.id.sqlIn(param("inParam").type<number[]>())
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
    .select(cols => ({
        customerId: cols.customers.id,
        customerName: cols.customers.name,
        customerCreatedBy: cols.customers.createdBy,
        userId: cols.users.id,
        userUserName: cols.users.userName,
        userCreatedAt: cols.users.createdAt,
        parentUserId: cols.parentUsers.id,
        parentUserUserName: cols.parentUsers.userName,
        parentUserCreatedAt: cols.parentUsers.createdAt,
        orderId: cols.orders.id,
        orderCustomerId: cols.orders.customerId,
        orderCreatedBy: cols.orders.createdBy
    }))
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
}
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
    inParam: number[];
    parentUserEq1: number | null;
    parentUserBetLeft: number | null;
    parentUserGt2: number | null; //
    innerCoalesce: number | null; //
    parentUserNeq3: string | null;
    innerParentUserParam1: string | null;
} | undefined;
type AutoSelectMultiJoinsParamsType = typeof AutoSelectMultiJoins extends (param: infer TParams) => any ? TParams : never;
type AutoSelectMultiJoinsParamsText = AssertTrue<AssertEqual<AutoSelectMultiJoinsParamsResult, AutoSelectMultiJoinsParamsType>>

/**
 * 
 */
const SingleLevelSelectWithJoins = customersTable
    .join('INNER', usersTable, (cols) => {
        type t = typeof cols;

        return cols.users.id.eq(1);
    })
    .join('INNER', ordersTable, (cols) => {
        type t = typeof cols;

        return cols.orders.id.eq(1);

    })
    .join('INNER', shipmentsTable, (cols) => {
        type t = typeof cols;

        return cols.shipments.orderId.eq(1);
    })
    .select(cols => ({ id: cols.customers.id, orderCustomerId: cols.orders.customerId, customerName: cols.customers.name }))
    .exec;
type SingleLevelSelectWithJoinsResult = { id: number, orderCustomerId: number, customerName: string }
type SingleLevelSelectWithJoinsTest = AssertTrue<AssertEqual<SingleLevelSelectWithJoinsResult, ReturnType<typeof SingleLevelSelectWithJoins>>>;

type SingleLevelSelectWithJoinsParams = typeof SingleLevelSelectWithJoins extends (params: infer TParams) => any ? TParams : never;
type SingleLevelSelectWithJoinsParamsTest = AssertTrue<AssertEqual<undefined, SingleLevelSelectWithJoinsParams>>;
/**
 * 
 */
const MultiLevelSelectWithJoins = customersTable
    .join('INNER', usersTable, (cols) => cols.users.id.eq(1))
    .join('INNER', usersTable.as("parentUsers"), (cols) => cols.parentUsers.id.eq(1))
    .select((cols, { jsonBuildObject }) => ({
        customerId: cols.customers.id,
        userName: cols.users.userName,
        subProp: jsonBuildObject({ parentUserId: cols.parentUsers.id, customers: jsonBuildObject(cols.customers) })
    }))
    .exec;
type multiLevelSelectWithJoinsExpectedResult = {
    customerId: number,
    userName: string,
    subProp: {
        parentUserId: number,
        customers: {
            id: number,
            name: string,
            createdBy: number
        }
    }
}
type multiLevelSelectWithJoinsResult = ReturnType<typeof MultiLevelSelectWithJoins>
type MultiLevelSelectWithJoinsTest = AssertTrue<AssertEqual<multiLevelSelectWithJoinsExpectedResult, multiLevelSelectWithJoinsResult>>
