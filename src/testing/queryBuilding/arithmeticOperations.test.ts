import test from "node:test";
import assert from "node:assert";

import { customersTable } from "../_tables.js";

test.suite("ARITHMETIC OPERATIONS TESTS", () => {
    test("Grouped arithmetic operations in where clause.", () => {
        const qb = customersTable.select().where((tables, { arithmeticAdd }) => arithmeticAdd(tables.customers.id, 10, 20, arithmeticAdd(1, 2, arithmeticAdd(tables.customers.id, 100))).eq(10));
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT * FROM "customers" WHERE "customers"."id"+10+20+(1+2+("customers"."id"+100))=10`, query);
    });

    test("Grouped arithmetic operations in select clause.", () => {
        const qb = customersTable.select((tables, { arithmeticAdd }) => [arithmeticAdd(tables.customers.id, 10, 20)]);
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT "customers"."id"+10+20 FROM "customers"`, query);
    });
});
