import test from "node:test";
import assert from "node:assert";

import { customersTable } from "../_tables.js";

const res = customersTable.select();
const buildRes = res.buildSQL();
const query = buildRes.query;

test("Select all from customers query.", () => {
    assert.equal(query, `SELECT * FROM "customers"`);
});