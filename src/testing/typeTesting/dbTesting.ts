import { Client } from 'pg';

const client = new Client({
    user: "postgres",
    password: "12345678",
    host: "localhost",
    port: 5432,
    database: 'northwind'
});

await client.connect();


// Returns two columns, second column name is sum.
const res = await client.query("SELECT customer_id, sum(freight),sum(ship_via) FROM orders GROUP BY customer_id;");

console.log(res);