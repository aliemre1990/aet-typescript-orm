import { jsonBuildObject } from "../../../query/functions/jsonFunctions/jsonBuildObject.js";
import { customersTable } from "../_tables.js";

const simpleJsonBuildObj = customersTable.select(cols => ({ id: cols.customers.id, obj: jsonBuildObject({ id: cols.customers.id, bd: jsonBuildObject({ sd: cols.customers.name }) }) })).exec();


const groupedJsonBuildObj = customersTable
    .groupBy(cols => [cols.customers.id])
    .select(cols => ({ id: jsonBuildObject({ id: cols.customers.id }) }));


const aggregatedJsonBuildObj = customersTable
    .groupBy(cols => [cols.customers.id])
    // @ts-expect-error
    .select(cols => ({ id: jsonBuildObject({ id: cols.customers.name }) }))