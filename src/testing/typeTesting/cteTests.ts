import QueryBuilder, { withAs } from "../../query/queryBuilder.js";
import { customersTable, ordersTable } from "./_tables.js";

const res = withAs("customerCte", customersTable.select((tables) => [tables.customers.id]))
    .from((cteSpecs) => [cteSpecs.customerCte])
    .join('INNER', (ctes) => ordersTable, (tables) => tables.customerCte.id.eq(tables.orders.customerId))
    .select((tables) => [tables.customerCte.id]);
