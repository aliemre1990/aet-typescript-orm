import { withAs, withRecursiveAs } from "../../query/cte.js";
import type CTEObject from "../../query/cteObject.js";
import QueryBuilder from "../../query/queryBuilder.js";
import { customersTable, employeesTable, ordersTable } from "./_tables.js";

const res = withAs("customerCte", customersTable.select((tables) => [tables.customers.id]))
    .from((cteSpecs) => [cteSpecs.customerCte])
    .join('INNER', (ctes) => ordersTable, (tables) => tables.customerCte.id.eq(tables.orders.customerId))
    .join('LEFT', (ctes) => employeesTable, (tables) => tables.employees.id.eq(tables.orders.createdBy))
    .select((tables) => [tables.customerCte.id]);


const chain = withAs(
    "employeesCTE",
    employeesTable
        .select((tables, { round, param }) => [round(tables.employees.id, param("roundParam"))])
).withAs(
    "employeesCTE",
    () =>
        employeesTable
            .select((tables, { round, param }) => [round(tables.employees.id, param("roundParam2"))])
).from((ctes) => [ctes.employeesCTE])
    .select((tbls) => [tbls.employeesCTE])
    .exec;

const res2 = employeesTable.select((tbls) => [tbls.employees]).exec;

const res1 = employeesTable
    .join("LEFT", () => customersTable, (tbles) => tbles.customers.id.eq(tbles.employees.id))
    .join("LEFT", () => ordersTable, (tbls) => tbls.orders.customerId.eq(tbls.customers.id))
    .select((tables) => [tables.employees, tables.customers, tables.orders]).exec;


const res3 = withRecursiveAs(
    "rec",
    ["id", "name"],
    customersTable.where((tbl, { param }) => tbl.customers.id.eq(param("id"))).select((tbl) => [tbl.customers.id, tbl.customers.name, tbl.customers.createdBy]),
    "UNION", (self) => {

        return employeesTable.select(() => []);
    }).from((tbls) => [tbls.rec])
    .select((tbls) => [tbls.rec.id, tbls.rec.name]);

