import test from "node:test";
import assert from "node:assert";

import { customersTable, ordersTable } from "../_tables.js";
import type { IComparable } from "../../query/_interfaces/IComparable.js";

test.suite("COMPARISON OPERATIONS TESTS", () => {
    test("Literal at left side of basic eq comparison.", () => {
        const qb = customersTable.select()
            .where((tables, { literal }) => literal(10).eq(tables.customers.id));
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT * FROM "customers" WHERE 10="customers"."id"`, query);
    });

    test("Literal at right side of basic eq comparison.", () => {
        const qb = customersTable.select()
            .where((tables, { literal }) => tables.customers.id.eq(literal(10)));
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT * FROM "customers" WHERE "customers"."id"=10`, query);
    });

    test("Value at right side of basic eq comparison.", () => {
        const qb = customersTable.select()
            .where((tables) => tables.customers.id.eq(1));
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT * FROM "customers" WHERE "customers"."id"=1`, query);
    });

    test("Param at right side of basic eq comparison.", () => {
        const qb = customersTable.select()
            .where((tables, { param }) => tables.customers.id.eq(param("param")));
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT * FROM "customers" WHERE "customers"."id"=$1`, query);
    });

    test("Query at left side of basic eq comparison.", () => {
        const qb = customersTable.select()
            .where((tables) => ordersTable.select((tables) => [tables.orders.customerId]).where((innerTables) => innerTables.orders.amount.eq(100)).eq(tables.customers.id));
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT * FROM "customers" WHERE (SELECT "orders"."customerId" FROM "orders" WHERE "orders"."amount"=100)="customers"."id"`, query);
    });

    test("Query at both side of basic eq comparison.", () => {
        const qb = customersTable.select()
            .where((tables) => ordersTable.select((tables) => [tables.orders.customerId]).where((innerTables) => innerTables.orders.amount.eq(100)).eq(customersTable.select((tables) => [tables.customers.id])));
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT * FROM "customers" WHERE (SELECT "orders"."customerId" FROM "orders" WHERE "orders"."amount"=100)=(SELECT "customers"."id" FROM "customers")`, query);
    });

    test("In comparison with query", () => {
        const qb = customersTable.select()
            .where((tables) => tables.customers.id.sqlIn(ordersTable.select((innerTables) => [innerTables.orders.customerId])));
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT * FROM "customers" WHERE "customers"."id" IN (SELECT "orders"."customerId" FROM "orders")`, query);
    });

    test("In comparison with values", () => {
        const qb = customersTable.select()
            .where((tables) => tables.customers.id.sqlIn(1, 2, 3));
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT * FROM "customers" WHERE "customers"."id" IN (1, 2, 3)`, query);
    });

    test("In comparison with params", () => {
        const qb = customersTable.select()
            .where((tables, { param }) => tables.customers.id.sqlIn(param("prm1"), param("prm2"), param("prm3")));
        const buildRes = qb.buildSQL();
        const query = buildRes.query;
        const params = buildRes.params;

        assert.equal(`SELECT * FROM "customers" WHERE "customers"."id" IN ($1, $2, $3)`, query);
        assert.equal(params[0], "prm1");
        assert.equal(params[1], "prm2");
        assert.equal(params[2], "prm3");
    });

    test("In comparison with literals simple", () => {
        const qb = customersTable.select()
            .where((tables, { literal, or }) => literal(1).sqlIn(tables.customers.id, literal(2), literal(3)));
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT * FROM "customers" WHERE 1 IN ("customers"."id", 2, 3)`, query);
    });

    test("In comparison with literals complex", () => {
        const qb = customersTable.select()
            .where((tables, { literal, or }) => or(literal(1).sqlIn(tables.customers.id, literal(2), literal(3)), tables.customers.id.sqlIn(literal(3), literal(4))));
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT * FROM "customers" WHERE 1 IN ("customers"."id", 2, 3) OR "customers"."id" IN (3, 4)`, query);
    });


    test("In comparison with literals and params", () => {
        const qb = customersTable.select()
            .where((tables, { literal, param }) => literal(1).sqlIn(tables.customers.id, literal(2), param("num")));
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT * FROM "customers" WHERE 1 IN ("customers"."id", 2, $1)`, query);
        assert.equal(buildRes.params[0], "num")
    });

    test("Query at left side of between comparison", () => {
        const qb = customersTable.select()
            .where((tables) => tables.customers.id.between(ordersTable.select((innerTables) => [innerTables.orders.customerId]), 100));
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT * FROM "customers" WHERE "customers"."id" BETWEEN (SELECT "orders"."customerId" FROM "orders") AND 100`, query);
    });

    test("Literal at left side of between comparison", () => {
        const qb = customersTable.select()
            .where((tables, { literal }) => tables.customers.id.between(literal(50), 100));
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT * FROM "customers" WHERE "customers"."id" BETWEEN 50 AND 100`, query);
    });


    test("Literal comparing with between", () => {
        const qb = customersTable.select()
            .where((tables, { literal }) => literal(50).between(tables.customers.id, 100));
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        assert.equal(`SELECT * FROM "customers" WHERE 50 BETWEEN "customers"."id" AND 100`, query);
    });
});
