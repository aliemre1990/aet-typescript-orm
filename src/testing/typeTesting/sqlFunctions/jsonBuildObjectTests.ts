import type { IComparable } from "../../../query/_interfaces/IComparable.js";
import { customersTable } from "../_tables.js";

const simpleJsonBuildObj = customersTable.select((cols, { jsonBuildObject }) => ({ id: cols.customers.id, obj: jsonBuildObject({ id: cols.customers.id, bd: jsonBuildObject({ sd: cols.customers.name }) }) })).exec();


const groupedJsonBuildObj = customersTable
    .groupBy(cols => [cols.customers.id])
    .select((cols, { jsonBuildObject }) => ({ id: jsonBuildObject({ id: cols.customers.id }) }));


const aggregatedJsonBuildObj = customersTable
    .groupBy(cols => [cols.customers.id])
    // @ts-expect-error
    .select((cols, { jsonBuildObject }) => {

        const jsonbObjectResult = jsonBuildObject({ id: cols.customers.id });
        type TestType = typeof jsonbObjectResult extends IComparable<any, infer TId, any, any, any, any, any, any> ? TId : never;

        return ({ id: jsonBuildObject({ id: cols.customers.name }) })
    })