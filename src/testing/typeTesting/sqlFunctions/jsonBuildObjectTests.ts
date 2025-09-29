import type { IComparable } from "../../../query/_interfaces/IComparable.js";
import { customersTable } from "../_tables.js";

const simpleJsonBuildObj = customersTable.select((cols, { jsonBuildObject }) => [
    cols.customers.id,
    jsonBuildObject({ id: cols.customers.id, bd: jsonBuildObject({ sd: cols.customers.name }) }).as("obj")
]).exec();


const groupedJsonBuildObj = customersTable
    .groupBy(cols => [cols.customers.id])
    .select((cols, { jsonBuildObject }) => [jsonBuildObject({ id: cols.customers.id })]).exec;


const aggregatedJsonBuildObj = customersTable
    .groupBy(cols => [cols.customers.id])
    // @ts-expect-error
    .select((cols, { jsonBuildObject }) => {

        const jsonbObjectResult = jsonBuildObject({ id: cols.customers.id });
        type TestType = typeof jsonbObjectResult extends IComparable<any, infer TId, any, any, any, any, any, any> ? TId : never;

        return [jsonBuildObject({ id: cols.customers.name })]
    })