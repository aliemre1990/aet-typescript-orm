import test from "node:test";
import assert from "node:assert";

import { withAs, withRecursiveAs } from "../../query/cte.js";
import { employeesTable } from "../_tables.js";
import { joinTypes, unionTypes } from "../../query/queryBuilder.js";

test.suite("SIMPLE CTE TESTS", () => {

    test("Select all from cte.", () => {
        const qb = withRecursiveAs(
            "subordinates",
            ['id', 'managerId', 'name'],
            employeesTable.select((tables) => [tables.employees.id, tables.employees.managerId, tables.employees.name]).where((tables) => tables.employees.id.eq(1)),
            "UNION_ALL",
            (self) => employeesTable
                .select((tables) => [tables.employees.id, tables.employees.managerId, tables.employees.name])
                .join("INNER", self, (tables) => tables.employees.id.eq(tables.subordinates.managerId))
        )
            .from((ctes) => [ctes.subordinates])
            .select((tables) => [tables.subordinates.id, tables.subordinates.managerId, tables.subordinates.name]);
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        let actual = `WITH RECURSIVE "subordinates"("id","managerId","name") AS`;
        actual += `())`;

        assert.equal(actual, query);
    });
});
