import test from "node:test";
import assert from "node:assert";

import { customersTable, orderDetailsTable, ordersTable, shipmentsTable } from "../_tables.js";
import { withAs } from "../../query/cte.js";

test.suite("JOIN TESTS", () => {
    test("Select all from customers with orders and shipments.", () => {
        const qb = customersTable
            .join("INNER", ordersTable, (tables) => tables.customers.id.eq(tables.orders.customerId))
            .join("INNER", orderDetailsTable, (tables) => tables.orders.id.eq(tables.orderDetails.orderId))
            .join("INNER", shipmentsTable, (tables) => tables.orders.id.eq(tables.shipments.orderId))
            .where((tables, { param }) => tables.customers.id.eq(param("cstId")))
            .select();
        const buildRes = qb.buildSQL();

        const query = buildRes.query;
        const params = buildRes.params;

        let actual = `SELECT * FROM "customers" `
            + `INNER JOIN "orders" ON "customers"."id"="orders"."customerId" `
            + `INNER JOIN "orderDetails" ON "orders"."id"="orderDetails"."orderId" `
            + `INNER JOIN "shipments" ON "orders"."id"="shipments"."orderId" `
            + `WHERE "customers"."id"=$1`

        assert.equal(actual, query);
        assert.equal("cstId", params[0]);
    });

    test("Join CTE", () => {
        const qb = withAs("orders", ordersTable.select().where((tables, { param }) => tables.orders.id.eq(param("ordId"))))
            .from(customersTable)
            .join("LEFT", (ctes) => ctes.orders, (tables) => tables.orders.customerId.eq(tables.customers.id))
            .select();
        const buildRes = qb.buildSQL();

        const query = buildRes.query;
        const params = buildRes.params;

        let actual = `WITH "orders" AS (`
            + `SELECT * FROM "orders" WHERE "orders"."id"=$1) `
            + `SELECT * FROM "customers" `
            + `LEFT JOIN "orders" ON "orders"."customerId"="customers"."id"`;

        assert.equal(actual, query);
        assert.equal("ordId", params[0]);
    });

    test("Join SubQuery", () => {
        const qb = customersTable
            .join(
                "LEFT",
                ordersTable.select().where((tables, { param }) => tables.orders.id.eq(param("ordId"))).as("orders"),
                (tables) => tables.customers.id.eq(tables.orders.customerId)
            )
            .select();
        const buildRes = qb.buildSQL();

        const query = buildRes.query;
        const params = buildRes.params;

        let actual = `SELECT * FROM "customers" `
            + `LEFT JOIN (SELECT * FROM "orders" WHERE "orders"."id"=$1) AS "orders" ON "customers"."id"="orders"."customerId"`;

        assert.equal(actual, query);
        assert.equal("ordId", params[0]);
    });

});