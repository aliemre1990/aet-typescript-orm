import { customersTable, employeesTable, shipmentsTable, usersTable } from "./_tables.js";
import type { AssertEqual, AssertTrue } from "./_typeTestingUtilities.js";

/**
 * 
 */
const SingleTableGroupAutoSelectQuery = customersTable
    .groupBy(cols => [cols.customers.customerId, cols.customers.name])
    .select(cols => ({ id: cols.customers.customerId, name: cols.customers.name }))
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

        return ({
            customerId: cols.customers.customerId,
            customerName: cols.customers.name,
            customerCreatedBy: cols.customers.createdBy,
            userId: cols.users.id,
            shipmentId: cols.shipments.id,
            shipmentOrderId: cols.shipments.orderId,
            shipmentCreatedBy: cols.shipments.createdBy,
            sumNull: sum(cols.employees.salary),
            sumNotNull: sum(cols.employees.deptId),
            jsonAggResult2: jsonAgg(cols.customers.customerId),
            jsonAggResult3: jsonAgg(jsonBuildObject(cols.customers))
        })
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
    jsonAggResult3: { customerId: number, name: string, createdBy: number }[]
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
    .select((cols, { jsonBuildObject }) => ({
        id: cols.customers.customerId,
        customerName: cols.customers.name,
        customer: jsonBuildObject({ id: cols.customers.customerId, name: cols.customers.name, createdBy: cols.customers.createdBy }),
        example: jsonBuildObject({ id: cols.shipments.id, shipment: jsonBuildObject({ id: cols.shipments.id, orderId: cols.shipments.orderId, createdBy: cols.shipments.createdBy }) })
    }))
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
    .having((cols, { param, sum, and }) => and(cols.customers.customerId.eq(param("havingParam")), sum(cols.shipments.id).eq(param("sumParam"))))
    .select((cols) => ({ id: cols.customers.customerId }))
    .exec;