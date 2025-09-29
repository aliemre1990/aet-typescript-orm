import type { IComparable } from "../../query/_interfaces/IComparable.js";
import { customersTable, employeesTable, shipmentsTable, usersTable } from "./_tables.js";
import type { AssertEqual, AssertTrue } from "./_typeTestingUtilities.js";

/**
 * 
 */
const SingleTableGroupAutoSelectQuery = customersTable
    .groupBy(cols => [cols.customers.id, cols.customers.name])
    .select(cols => [cols.customers.id, cols.customers.name])
    .exec;

type SingleTableGroupAutoSelectQueryResult = { id: number, name: string }[];
type SingleTableGroupAutoSelectQueryReturnType = ReturnType<typeof SingleTableGroupAutoSelectQuery>;
type SingleTableGroupAutoSelectQueryTest = AssertTrue<AssertEqual<SingleTableGroupAutoSelectQueryResult, SingleTableGroupAutoSelectQueryReturnType>>


const res = employeesTable.as("emp");
type typeofcol = typeof res.columns.salary;

/**
 * 
 */
const MultiTableGroupByQuery = customersTable
    .join('INNER', usersTable, cols => cols.users.id.eq(cols.customers.createdBy))
    .join('INNER', shipmentsTable, cols => cols.shipments.id.eq(1))
    .join('INNER', employeesTable, cols => cols.shipments.id.eq(1))
    .groupBy(cols => [cols.customers, cols.users.id, cols.shipments, cols.employees.id])
    .select((cols, { sum, jsonAgg, jsonBuildObject }) => {

        type t = (typeof cols.employees.salary);

        return [
            cols.customers.id.as("customerId"),
            cols.customers.name.as("customerName"),
            cols.customers.createdBy.as("customerCreatedBy"),
            cols.users.id.as("userId"),
            cols.shipments.id.as("shipmentId"),
            cols.shipments.orderId.as("shipmentOrderId"),
            cols.shipments.createdBy.as("shipmentCreatedBy"),
            sum(cols.employees.salary).as("sumNull"),
            sum(cols.employees.deptId).as("sumNotNull"),
            jsonAgg(cols.customers.id).as("jsonAggResult2"),
            jsonAgg(jsonBuildObject(cols.customers)).as("jsonAggResult3")
        ]
    }
    )
    .exec;

type MultiTableGroupByQueryResult = {
    customerId: number,
    customerName: string,
    customerCreatedBy: number,
    userId: number,
    shipmentId: number,
    shipmentOrderId: number,
    shipmentCreatedBy: number,
    sumNull: number | null,
    sumNotNull: number,
    jsonAggResult2: number[],
    jsonAggResult3: { id: number, name: string, createdBy: number }[]
}[]
type MultiTableGroupByQueryReturnType = ReturnType<typeof MultiTableGroupByQuery>;

type MultiTableGroupByQueryTest = AssertTrue<AssertEqual<MultiTableGroupByQueryResult, MultiTableGroupByQueryReturnType>>

/**
 * 
 */
const GroupByWithMultilevelSelectQuery = customersTable
    .join('INNER', usersTable, cols => cols.users.id.eq(cols.customers.createdBy))
    .join('INNER', shipmentsTable, cols => cols.shipments.id.eq(1))
    .groupBy((cols) => {
        return [cols.customers, cols.users.id, cols.shipments]
    })
    .select((cols, { jsonBuildObject }) => [
        cols.customers.id,
        cols.customers.name.as("customerName"),
        jsonBuildObject({ id: cols.customers.id, name: cols.customers.name, createdBy: cols.customers.createdBy }).as("customer"),
        jsonBuildObject({ id: cols.shipments.id, shipment: jsonBuildObject({ id: cols.shipments.id, orderId: cols.shipments.orderId, createdBy: cols.shipments.createdBy }) }).as("example")
    ])
    .exec;

type GroupByWithMultilevelSelectQueryResult = {
    id: number,
    customerName: string,
    customer: { id: number, name: string, createdBy: number },
    example: { id: number, shipment: { id: number, orderId: number, createdBy: number } }
}[]
type GroupByWithMultilevelSelectQueryReturnType = ReturnType<typeof GroupByWithMultilevelSelectQuery>;
type GroupByWithMultilevelSelectQueryTest = AssertTrue<AssertEqual<GroupByWithMultilevelSelectQueryResult, GroupByWithMultilevelSelectQueryReturnType>>


const GroupByHaving = customersTable
    .join('INNER', usersTable, cols => cols.users.id.eq(cols.customers.createdBy))
    .join('INNER', shipmentsTable, cols => cols.shipments.id.eq(1))
    .groupBy((cols) => {
        return [cols.customers, cols.users.id]
    })
    .having((cols, { param, sum, and }) => and(cols.customers.id.eq(param("havingParam")), sum(cols.shipments.id).eq(param("sumParam"))))
    .select((cols) => [cols.customers.id])
    .exec;