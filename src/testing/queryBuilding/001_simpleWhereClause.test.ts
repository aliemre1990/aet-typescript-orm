import test from "node:test";
import assert from "node:assert";

import { customersTable } from "../_tables.js";

test.suite("SIMPLE WHERE TESTS", () => {
    test("Select all from customers where customer id equals value query.", () => {
        const qb = customersTable.select().where((tables) => tables.customers.id.eq(1));
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT * FROM "customers" WHERE "customers"."id"=1`, query);
    });

    test("Select all from customers where customer id equals param query.", () => {
        const qb = customersTable.select().where((tables, { param }) => tables.customers.id.eq(param("cstId")));
        const buildRes = qb.buildSQL();
        const query = buildRes.query;
        const params = buildRes.params;

        assert.equal(`SELECT * FROM "customers" WHERE "customers"."id"=$1`, query);
        assert.equal(params[0], "cstId");
    });

    test("Select all from customers where customer id in values query.", () => {
        const qb = customersTable.select().where((tables) => tables.customers.id.sqlIn([1, 2, 3, 4]));
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT * FROM "customers" WHERE "customers"."id" IN (1, 2, 3, 4)`, query);
    });


    test("Select all from customers where customer id in sub query query.", () => {
        const qb = customersTable.select().where((tables) => tables.customers.id.sqlIn(customersTable.select((tables) => [tables.customers.id])));
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT * FROM "customers" WHERE "customers"."id" IN (SELECT "customers"."id" FROM "customers")`, query);
    });
});
