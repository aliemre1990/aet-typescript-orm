import { withAs } from "../../query/queryBuilder.js";
import { customersTable } from "./_tables.js";

const res = withAs("customerCte", customersTable.select((tables) => [tables.customers.id]))
    .from((ctes) => ctes.customerCte)
    .select((tables) => [tables.customerCte.id]);