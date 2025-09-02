import type { InferParamsFromOps } from "../../query/_types/result.js";
import type ColumnComparisonOperation from "../../query/comparisons/_comparisonOperations.js";
import pgCoalesce from "../../query/functions/coalesce.js";
import ColumnLogicalOperation, { and } from "../../query/logicalOperations.js";
import { param } from "../../query/param.js";
import QueryColumn from "../../query/queryColumn.js";
import type Column from "../../table/column.js";
import type { TableSpecsType } from "../../table/types/tableSpecs.js";
import { customersTable, ordersTable, shipmentsTable, usersTable } from "./_tables.js";
import type { AssertEqual, AssertTrue } from "./_typeTestingUtilities.js";

/**
 * 
 */
const SingleTableAutoSelectWhereWithParamQuery = customersTable
    .where((cols) => cols.customers.id.eq(param("whereparam")))
    .select()
    .exec;

type SingleTableAutoSelectWhereWithParamQueryResult = { id: number, name: string, createdBy: number };
type SingleTableAutoSelectWhereWithParamQueryReturnType = ReturnType<typeof SingleTableAutoSelectWhereWithParamQuery>;
type SingleTableAutoSelectWhereWithParamQueryTest = AssertTrue<AssertEqual<SingleTableAutoSelectWhereWithParamQueryResult, SingleTableAutoSelectWhereWithParamQueryReturnType>>

/**
 * 
 */
const SingleQueryTableAutoSelectQuery = customersTable.as("cst").select().exec;

type SingleQueryTableAutoSelectQueryResult = { id: number, name: string, createdBy: number };
type SingleQueryTableAutoSelectQueryReturnType = ReturnType<typeof SingleQueryTableAutoSelectQuery>
type SingleQueryTableAutoSelectQueryTest = AssertTrue<AssertEqual<SingleQueryTableAutoSelectQueryResult, SingleQueryTableAutoSelectQueryReturnType>>

/**
 * 
 */
const QueryTableJoinQuery = customersTable.as("cst")
    .join("INNER", usersTable, (cols) => cols.users.id.eq(cols.cst.createdBy))
    .select()
    .exec;

type QueryTableJoinQueryResult = { userId: number, userUserName: string, cstId: number, cstName: string, cstCreatedBy: number };
type QueryTableJoinQueryReturnType = ReturnType<typeof QueryTableJoinQuery>;
type QueryTableJoinQueryTest = AssertTrue<AssertEqual<QueryTableJoinQueryResult, QueryTableJoinQueryReturnType>>

/**
 * 
 */
const SingleTableAutoSelectQuery = customersTable.select().exec;

type SingleTableAutoSelectQueryResult = { id: number; name: string; createdBy: number; };
type SingleTableAutoSelectQueryReturnType = ReturnType<typeof SingleTableAutoSelectQuery>
type SingleTableAutoSelectQueryTest = AssertTrue<AssertEqual<SingleTableAutoSelectQueryResult, SingleTableAutoSelectQueryReturnType>>;

/**
 * 
 */
const SingleTableJoinWithAutoSelectQuery = customersTable
    .join('INNER', usersTable, (cols) => cols.users.id.eq(param("param1")))
    .select()
    .exec;

type SingleTableJoinWithAutoSelectQueryResult = {
    customerId: number;
    customerName: string;
    customerCreatedBy: number;
    userId: number;
    userUserName: string;
};
type SingleTableJoinWithAutoSelectQueryReturnType = ReturnType<typeof SingleTableJoinWithAutoSelectQuery>;
type SingleTableJoinWithAutoSelectQueryTest = AssertTrue<AssertEqual<SingleTableJoinWithAutoSelectQueryResult, SingleTableJoinWithAutoSelectQueryReturnType>>

/**
 * 
 */
const AutoSelectMultiJoins = customersTable
    .join('INNER', usersTable, (cols) => {

        const res1 = and(
            cols.users.id.eq(param("userParam1")),
            cols.users.id.eq(param("userParam2")),
            cols.users.userName.eq(param("userParam3")),
            cols.users.id.between(param("userBetweenLeft"), param("userBetweenRight")),
            and(
                cols.users.id.eq(cols.customers.createdBy),
                cols.customers.name.eq(param("userGteParam4")),
                and(cols.users.id.eq(param("userEqParam1"))),
                cols.users.id.sqlIn(param("inParam"))
            )
        );

        const inres = cols.users.id.sqlIn(...[cols.customers.id, cols.users.id]);
        type inrest = typeof inres extends ColumnComparisonOperation<any, any, any, infer TCols, any> ? TCols : never;
        type prm = inrest[1];

        return res1;

        // const inres = cols.users.id.sqlIn(1, cols.customers.id, 2, cols.users.id, cols.customers.id);
        // type inrest = typeof inres extends ColumnComparisonOperation<any, any, any, infer TCols, any> ? TCols : never;
        // type prm = inrest[1];
    })
    .join('INNER', usersTable.as('parentUsers'), (cols) => {

        const comp = and(
            cols.parentUsers.id.eq(cols.customers.id),
            cols.parentUsers.id.eq(param("parentUserEq1")),
            cols.parentUsers.id.between(param("parentUserBetLeft"), cols.customers.id),
            cols.parentUsers.id.eq(pgCoalesce(param("parentUserGt2"), 1, 2, pgCoalesce(1, 2, param("innerCoalesce")))),
            cols.parentUsers.userName.eq(param("parentUserNeq3")),
            cols.parentUsers.userName.between(cols.customers.name, cols.users.userName),
            and(cols.customers.createdBy.eq(235), cols.parentUsers.userName.eq(param("innerParentUserParam1")))
        );


        return comp;

        type inferComparison = typeof comp;
        type ops = inferComparison extends ColumnLogicalOperation<any, infer ops> ? ops : never;

        /**
         * 
         */
        type op0 = ops[0];
        type op0AppliedColumnType = op0 extends ColumnComparisonOperation<any, any, any, infer TAppliedCol, any, any> ? TAppliedCol : never;
        type op0ColumnType = op0AppliedColumnType[0] extends QueryColumn<any, infer TCol, any, any> ? TCol : never;

        type op0ColumnResult = Column<"postgresql", "SERIAL", "id", TableSpecsType<"customers">>;
        type op0Test = AssertTrue<AssertEqual<op0ColumnResult, op0ColumnType>>;

        type op1 = ops[1];
        type op1Params = op1 extends ColumnComparisonOperation<any, any, infer TParams, any, any> ? TParams : never;


    })
    .join('INNER', ordersTable, (cols) => cols.users.userName.eq(cols.customers.name))
    .select()
    .exec;

type AutoSelectMultiJoinsResult = {
    customerId: number;
    customerName: string;
    customerCreatedBy: number;
    userId: number;
    userUserName: string;
    parentUserId: number;
    parentUserUserName: string;
    orderId: number;
    orderCustomerId: number;
    orderCreatedBy: number;
}
type AutoSelectMultiJoinsReturnType = ReturnType<typeof AutoSelectMultiJoins>
type AutoSelectMultiJoinsTest = AssertTrue<AssertEqual<AutoSelectMultiJoinsResult, AutoSelectMultiJoinsReturnType>>;

type AutoSelectMultiJoinsParamsResult = {
    userParam1: number;
    userParam2: number;
    userParam3: string;
    userBetweenLeft: number;
    userBetweenRight: number;
    userGteParam4: string;
    userEqParam1: number;
    inParam: number[];
    parentUserEq1: number;
    parentUserBetLeft: number;
    parentUserGt2: number;
    innerCoalesce: any;
    parentUserNeq3: string;
    innerParentUserParam1: string;
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
    .select(cols => ({
        customerId: cols.customers.id,
        userName: cols.users.userName.as("username1"),
        subProp: {
            parentUserId: cols.parentUsers.id,
            customers: cols.customers
        }
    }))
    .exec;
type multiLevelSelectWithJoinsExpectedResult = {
    customerId: number,
    username1: string,
    subProp: {
        parentUserId: number,
        customers: {
            id: number,
            name: string,
            createdBy: number
        }
    }
}
type MultiLevelSelectWithJoinsTest = AssertTrue<AssertEqual<multiLevelSelectWithJoinsExpectedResult, ReturnType<typeof MultiLevelSelectWithJoins>>>
