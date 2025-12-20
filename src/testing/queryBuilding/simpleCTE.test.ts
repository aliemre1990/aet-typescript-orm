import test from "node:test";
import assert from "node:assert";

import { customersTable } from "../_tables.js";
import { withAs } from "../../query/cte.js";

test.suite("SIMPLE CTE TESTS", () => {

    test("Select all from cte.", () => {
        const qb = withAs("cst", customersTable.select()).from((ctes) => [ctes.cst.as("cstCTE")]).select();
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        const actual = `WITH "cst" AS (SELECT * FROM "customers") SELECT * FROM "cst" AS "cstCTE"`;

        assert.equal(actual, query);
    });
});
