import { customersTable, employeesTable } from "./_tables.js";

customersTable
    .select((tbls) => [tbls.customers])
    .union(
        () => employeesTable
            .where((tbls, { param }) => tbls.employees.deptId.sqlIn([param("inParam")]))
            .select(tbls2 => [tbls2.employees])
    ).exec;

