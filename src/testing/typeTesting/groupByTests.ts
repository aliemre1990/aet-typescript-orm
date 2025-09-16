import { customersTable, shipmentsTable, usersTable } from "./_tables.js";
import type { AssertEqual, AssertTrue } from "./_typeTestingUtilities.js";

/**
 * 
 */
const SingleTableGroupAutoSelectQuery = customersTable
    .groupBy(cols => [cols.customers.id, cols.customers.name])
    .select(cols => ({ id: cols.customers.id, name: cols.customers.name }))
    .exec;

type SingleTableGroupAutoSelectQueryResult = { id: number, name: string };
type SingleTableGroupAutoSelectQueryReturnType = ReturnType<typeof SingleTableGroupAutoSelectQuery>;
type SingleTableGroupAutoSelectQueryTest = AssertTrue<AssertEqual<SingleTableGroupAutoSelectQueryResult, SingleTableGroupAutoSelectQueryReturnType>>

/**
 * 
 */
const MultiTableGroupByWithAutoSelectQuery = customersTable
    .join('INNER', usersTable, cols => cols.users.id.eq(cols.customers.createdBy))
    .join('INNER', shipmentsTable, cols => cols.shipments.id.eq(1))
    .groupBy(cols => [cols.customers, cols.users.id, cols.shipments])
    .select((cols, { }) => ({
        customerId: cols.customers.id,
        customerName: cols.customers.name,
        customerCreatedBy: cols.customers.createdBy,
        userId: cols.users.id,
        shipmentId: cols.shipments.id,
        shipmentOrderId: cols.shipments.orderId,
        shipmentCreatedBy: cols.shipments.createdBy
    })
    )
    .exec;

type MultiTableGroupByWithAutoSelectQueryResult = { customerId: number, customerName: string, customerCreatedBy: number, userId: number, shipmentId: number, shipmentOrderId: number, shipmentCreatedBy: number }
type MultiTableGroupByWithAutoSelectQueryReturnType = ReturnType<typeof MultiTableGroupByWithAutoSelectQuery>;
type MultiTableGroupByWithAutoSelectQueryTest = AssertTrue<AssertEqual<MultiTableGroupByWithAutoSelectQueryResult, MultiTableGroupByWithAutoSelectQueryReturnType>>

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
        id: cols.customers.id,
        customerName: cols.customers.name,
        customer: jsonBuildObject({ id: cols.customers.id, name: cols.customers.name, createdBy: cols.customers.createdBy }),
        example: jsonBuildObject({ id: cols.shipments.id, shipment: jsonBuildObject({ id: cols.shipments.id, orderId: cols.shipments.orderId, createdBy: cols.shipments.createdBy }) })
    }))
    .exec;

type GroupByWithMultilevelSelectQueryResult = {
    id: number,
    customerName: string,
    customer: { id: number, name: string, createdBy: number },
    example: { id: number, shipment: { id: number, orderId: number, createdBy: number } }
}
type GroupByWithMultilevelSelectQueryReturnType = ReturnType<typeof GroupByWithMultilevelSelectQuery>;
type GroupByWithMultilevelSelectQueryTest = AssertTrue<AssertEqual<GroupByWithMultilevelSelectQueryResult, GroupByWithMultilevelSelectQueryReturnType>>
