import test from "node:test";
import assert from "node:assert";

import { customersTable } from "../_tables.js";

test.suite("ARITHMETIC OPERATIONS TESTS", () => {
    test("Simple arithmetics in select clause.", () => {
        const qb = customersTable.select((tables, { arithmeticAddition }) => [arithmeticAddition(1, tables.customers.id)]);
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT 1+"customers"."id" FROM "customers"`, query);
    });

    test("Simple arithmetics with column alias in select clause.", () => {
        const qb = customersTable.select((tables, { arithmeticAddition }) => [arithmeticAddition(1, tables.customers.id).as("result")]);
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT 1+"customers"."id" AS "result" FROM "customers"`, query);
    });

    test("Simple arithmetics in select clause with params.", () => {
        const qb = customersTable.select((tables, { arithmeticAddition, param }) => [arithmeticAddition(tables.customers.id, param("prm1"))]);
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT "customers"."id"+$1 FROM "customers"`, query);
    });

    test("Simple arithmetics in select clause adds two columns.", () => {
        const qb = customersTable.select((tables, { arithmeticAddition, param }) => [arithmeticAddition(tables.customers.id, tables.customers.createdBy)]);
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT "customers"."id"+"customers"."createdBy" FROM "customers"`, query);
    });

    test("Grouped arithmetic operations in where clause.", () => {
        const qb = customersTable.select().where((tables, { arithmeticAddition }) => arithmeticAddition(tables.customers.id, 10, 20, arithmeticAddition(1, 2, arithmeticAddition(tables.customers.id, 100))).eq(10));
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT * FROM "customers" WHERE "customers"."id"+10+20+(1+2+("customers"."id"+100))=10`, query);
    });

    test("Grouped arithmetic operations in select clause.", () => {
        const qb = customersTable.select((tables, { arithmeticAddition }) => [arithmeticAddition(tables.customers.id, 10, 20)]);
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT "customers"."id"+10+20 FROM "customers"`, query);
    });
});
