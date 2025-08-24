import type { IJoinQuery } from "../../query/_interfaces/IJoinQuery.js";
import type { InferParamsFromOps } from "../../query/_types/result.js";
import { and } from "../../query/logicalOperations.js";
import { param } from "../../query/param.js";
import { customersTable, ordersTable, shipmentsTable, usersTable } from "./_tables.js";
import type { AssertEqual, AssertTrue } from "./_typeTestingUtilities.js";

const res = customersTable.select(cols => {
    type t = typeof cols;

    return ({ id: cols.customers.name.as("customerName") })
}).exec();


const res5 = customersTable.select().exec();


const res6 = customersTable.join('INNER', usersTable, (cols) => cols.users.id.eq(param("ali"))).select().exec();
const res7 = customersTable
    .join('INNER', usersTable, (cols) => {

        const res1 = and(
            cols.users.id.eq(param("user1")),
            cols.users.id.gte(param("user2")),
            cols.users.userName.eq(param("user3")),
            and(cols.customers.createdBy.eq(235), cols.customers.name.eq(param("user4")), and(cols.users.id.eq(param("user5"))))
        );

        type infered = InferParamsFromOps<typeof res1>;

        return res1;

        // const res = cols.users.id.eq(param("zart"));
        // type t = typeof res;
        // type t2 = t extends ColumnComparisonOperation<infer TDbType, infer TQueryColumn, infer TParams, infer TValueType> ? TParams : never;

        // return res;

    })
    .join('INNER', usersTable.as('parentUsers'), (cols) => {

        const res1 = and(
            cols.users.id.eq(cols.customers.id),
            cols.users.id.eq(10),
            cols.users.id.gt(param("parent1")),
            cols.users.userName.gt(param("parent2")),
            and(cols.customers.createdBy.gt(235), cols.customers.name.gt(param("parent3")))
        );

        type infered = InferParamsFromOps<typeof res1>;

        return res1;
        // type tp = typeof res1;
        // type tp1 = tp extends ColumnLogicalOperation<any, infer TOps> ? TOps : never;
        // type tp2 = tp1[3] extends ColumnLogicalOperation<any, infer TOps2> ? TOps2 : never;
        // type tp4 = tp2[1] extends ColumnComparisonOperation<any, any, infer TParams, any> ? TParams : never;
        // type tp3 = tp2 extends ColumnComparisonOperation<any, any, infer TParams, any> ? TParams : never;

        // const res = cols.users.id.eq(param("asdf"));

        // type t = typeof res;
        // type t2 = t extends ColumnComparisonOperation<infer TDbType, infer TQueryColumn, infer TParams, infer TValueType> ? TParams : never;
    })
    .join('INNER', ordersTable, (cols) => cols.users.userName.eq(param("ali")))
    .select().exec();

type tp1 = typeof res7;
type tp2 = tp1 extends IJoinQuery<infer TDbType, infer TSelectedColumns, infer TParams> ? TParams : never;
type tp3 = tp2[5];

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
