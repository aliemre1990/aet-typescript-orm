import type { IComparable } from "../../../query/_interfaces/IComparable.js";
import { customersTable } from "../_tables.js";

const simpleJsonBuildObj = customersTable.select((cols, { jsonBuildObject }) => ({ id: cols.customers.customerId, obj: jsonBuildObject({ id: cols.customers.customerId, bd: jsonBuildObject({ sd: cols.customers.name }) }) })).exec();


const groupedJsonBuildObj = customersTable
    .groupBy(cols => [cols.customers.customerId])
    .select((cols, { jsonBuildObject }) => ({ id: jsonBuildObject({ id: cols.customers.customerId }) }));


const aggregatedJsonBuildObj = customersTable
    .groupBy(cols => [cols.customers.customerId])
    // @ts-expect-error
    .select((cols, { jsonBuildObject }) => {

        const jsonbObjectResult = jsonBuildObject({ id: cols.customers.customerId });
        type TestType = typeof jsonbObjectResult extends IComparable<any, infer TId, any, any, any, any, any> ? TId : never;

        return ({ id: jsonBuildObject({ id: cols.customers.name }) })
    })