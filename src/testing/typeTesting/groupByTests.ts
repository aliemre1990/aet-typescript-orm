import type ISelectClause from "../../query/_interfaces/ISelectClause.js";
import type { SpreadGroupedColumns } from "../../query/_types/grouping.js";
import { customersTable, shipmentsTable, usersTable } from "./_tables.js";
import type { AssertEqual, AssertTrue } from "./_typeTestingUtilities.js";

/**
 * 
 */
const SingleTableGroupAutoSelectQuery = customersTable
    .groupBy(cols => [cols.customers.id, cols.customers.name])
    .select()
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
    .select()
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
    .groupBy(cols => {
        return [cols.customers, cols.users.id, cols.shipments]
    })
    .select(cols => ({
        id: cols.customers.id,
        customerName: cols.customers.name,
        customer: cols.customers,
        example: {
            id: cols.shipments.id,
            shipment: cols.shipments
        }
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
