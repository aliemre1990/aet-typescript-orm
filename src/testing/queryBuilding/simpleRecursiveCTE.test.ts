import test from "node:test";
import assert from "node:assert";

import { withAs, withRecursiveAs } from "../../query/cte.js";
import { employeesTable } from "../_tables.js";
import { joinTypes, unionTypes } from "../../query/queryBuilder.js";

test.suite("SIMPLE RECURSIVE CTE TESTS", () => {

    test("Select subordinates.", () => {
        const qb = withRecursiveAs(
            "subordinates",
            ['id', 'managerIdx', 'name'],
            employeesTable.select((tables) => [tables.employees.id, tables.employees.managerId, tables.employees.name]).where((tables) => tables.employees.id.eq(1)),
            "UNION_ALL",
            (self) => employeesTable
                .select((tables) => [tables.employees.id, tables.employees.managerId.as('managerIdx'), tables.employees.name])
                .join("INNER", self, (tables) => tables.employees.id.eq(tables.subordinates.managerIdx))
        )
            .from((ctes) => [ctes.subordinates])
            .select((tables) => [tables.subordinates.id, tables.subordinates.managerIdx, tables.subordinates.name]);
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        let actual = `WITH RECURSIVE "subordinates"("id", "managerIdx", "name") AS `;
        actual = `${actual}(`;
        actual = `${actual}SELECT "employees"."id", "employees"."managerId", "employees"."name" FROM "employees" WHERE "employees"."id"=1`;
        actual = `${actual} UNION ALL (SELECT "employees"."id", "employees"."managerId" AS "managerIdx", "employees"."name" FROM "employees" INNER JOIN "subordinates" ON "employees"."id"="subordinates"."managerIdx")`;
        actual = `${actual})`;
        actual = `${actual} SELECT "subordinates"."id", "subordinates"."managerIdx", "subordinates"."name" FROM "subordinates"`;

        assert.equal(actual, query);
    });
});
