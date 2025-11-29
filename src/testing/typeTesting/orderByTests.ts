import type QueryColumn from "../../query/queryColumn.js";
import { customersTable, ordersTable, shipmentsTable, usersTable } from "../_tables.js";
import type { AssertEqual, AssertExtends, AssertTrue } from "./_typeTestingUtilities.js";

/**
 * 
 */
const SimpleOrderByQuery = customersTable
    .where((cols, { param }) => cols.customers.id.eq(param("whereparam")))
    .orderBy(cols => [cols.customers.name, [cols.customers.id, 'ASC']]);