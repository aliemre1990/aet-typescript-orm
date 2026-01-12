import test from "node:test";
import assert from "node:assert";

import { customersTable, ordersTable } from "../_tables.js";

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

    test("Select all columns using AS", () => {
        const qb = customersTable
            .select((tables) => [
                tables.customers.id.as("customerId"),
                tables.customers.name.as("customerName"),
                tables.customers.createdBy.as("customerCreatedBy")
            ])
            .where((tables) => tables.customers.id.eq(1));
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        let actual = `SELECT`;
        actual = `${actual} "customers"."id" AS "customerId", `;
        actual = `${actual}"customers"."name" AS "customerName", `;
        actual = `${actual}"customers"."createdBy" AS "customerCreatedBy" `
        actual = `${actual}FROM "customers" WHERE "customers"."id"=1`;

        assert.equal(actual, query);
    });

    test("Select single column using functions using AS", () => {
        const qb = customersTable
            .select((tables, { round }) => [
                round(tables.customers.id, 2).as("customerId")
            ]);
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        let actual = `SELECT ROUND("customers"."id", 2) AS "customerId" FROM "customers"`;

        assert.equal(actual, query);
    });

    test("Select single column using arithmetic operations using AS", () => {
        const qb = customersTable
            .select((tables, { arithmeticAddition }) => [
                arithmeticAddition(tables.customers.id, 2).as("customerId")
            ]);
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        let actual = `SELECT "customers"."id"+2 AS "customerId" FROM "customers"`;

        assert.equal(actual, query);
    });

    test("Select single column using aggregation operations using AS", () => {
        const qb = customersTable
            .select((tables, { avg }) => [
                avg(
                    ordersTable
                        .select((tables) => [tables.orders.amount])
                        .where((innerTables) => innerTables.orders.customerId.eq(tables.customers.id))
                ).as("avarageOrderAmount")
            ]);
        const buildRes = qb.buildSQL();
        const query = buildRes.query;

        let actual = `SELECT `;
        actual = `${actual}AVG(`;
        actual = `${actual}SELECT "orders"."amount" FROM "orders" WHERE "orders"."customerId"="customers"."id"`;
        actual = `${actual}) AS "avarageOrderAmount" FROM "customers"`;

        assert.equal(actual, query);
    });

});
