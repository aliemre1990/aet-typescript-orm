import { Client } from "pg";

const client = new Client({
    user: "postgres",
    password: "12345678",
    host: "localhost",
    port: 5432,
    database: "northwind"
});

// let query = `SELECT * FROM "orders" WHERE "order_id" IN $1;`;
// await client.connect();

// const res = await client.query(query, [[10248, 10251]]);

// console.log(res.rows);

// let query = `SELECT 1,2`;
// await client.connect();

// const res = await client.query(query);
// console.log(res.rows);

// let query = `SELECT $1`;
// await client.connect();

// const res = await client.query(query, [1]);
// console.log(res.rows);


let query = `SELECT 1+1`;
await client.connect();

const res = await client.query(query);
console.log(res.rows);