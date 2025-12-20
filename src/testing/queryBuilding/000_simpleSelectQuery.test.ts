import test from "node:test";
import assert from "node:assert";

import { customersTable } from "../_tables.js";

test.suite("SIMPLE SELECT TESTS", () => {
    test("Select all from customers query.", () => {
        const qb = customersTable.select();
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT * FROM "customers"`, query);
    });

    test("Select specific columns from customers.", () => {
        const qb = customersTable.select((tables) => ([tables.customers.id, tables.customers.name]));
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT "customers"."id", "customers"."name" FROM "customers"`, query);
    });

    test("Select all from customers table name.", () => {
        const qb = customersTable.select((tables) => [tables.customers]);
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT "customers".* FROM "customers"`, query);
    })


    test("Select all with as from customers.", () => {
        const qb = customersTable.as("cst").select();
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT * FROM "customers" AS "cst"`, query);
    });

    test("Select specific columns with as from customers.", () => {
        const qb = customersTable.as("cst").select((tables) => [tables.cst.id, tables.cst.name]);
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT "cst"."id", "cst"."name" FROM "customers" AS "cst"`, query);
    });

    test("Select all with as from customers using table name.", () => {
        const qb = customersTable.as("cst").select((tables) => [tables.cst]);
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT "cst".* FROM "customers" AS "cst"`, query);
    });

});
