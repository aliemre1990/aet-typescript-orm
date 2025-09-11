import { customersTable } from "../_tables.js";

const simpleJsonBuildObj = customersTable.select((cols, { jsonBuildObject }) => ({ id: cols.customers.id, obj: jsonBuildObject({ id: cols.customers.id, bd: jsonBuildObject({ sd: cols.customers.name }) }) })).exec();


const groupedJsonBuildObj = customersTable
    .groupBy(cols => [cols.customers.id])
    .select((cols, { jsonBuildObject }) => ({ id: jsonBuildObject({ id: cols.customers.id }) }));


const aggregatedJsonBuildObj = customersTable
    .groupBy(cols => [cols.customers.id])
    // @ts-expect-error
    .select((cols, { jsonBuildObject }) => ({ id: jsonBuildObject({ id: cols.customers.name }) }))