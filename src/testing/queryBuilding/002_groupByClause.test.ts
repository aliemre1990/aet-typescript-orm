import test from "node:test";
import assert from "node:assert";

import { employeesTable } from "../_tables.js";

test.suite("SIMPLE GROUP BY CLAUSE TESTS", () => {
    test("Select all from employees group by salary.", () => {
        const qb = employeesTable.select().groupBy((tables) => [tables.employees.salary]);
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT * FROM "employees" GROUP BY "employees"."salary"`, query);
    });

    test("Select all from employees group by salary and name.", () => {
        const qb = employeesTable.select().groupBy((tables) => [tables.employees.salary, tables.employees.name]);
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT * FROM "employees" GROUP BY "employees"."salary", "employees"."name"`, query);
    });

    test("Select all from employees group by function.", () => {
        const qb = employeesTable
            .select((tables, { arithmeticAddition }) => [arithmeticAddition(tables.employees.salary, 100)])
            .groupBy((tables, { arithmeticAddition }) => [arithmeticAddition(tables.employees.salary, 100)]);
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT "employees"."salary"+100 FROM "employees" GROUP BY "employees"."salary"+100`, query);
    });

    test("Select all from employees group by managerId check avarage salary.", () => {
        const qb = employeesTable
            .select((tables, { avg }) => [tables.employees.managerId, avg(tables.employees.salary)])
            .groupBy((tables) => [tables.employees.managerId])
            .having((tables, { avg }) => avg(tables.employees.salary).gt(500));
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT "employees"."managerId", AVG("employees"."salary") FROM "employees" GROUP BY "employees"."managerId" HAVING AVG("employees"."salary")>500`, query);
    });
});
