import { pgColumnTypes } from "../table/columnTypes.js";
import Column from "../table/column.js";
import { ForeignKey, pgColumn, pgTable } from "../table/table.js";

const usersTable = pgTable(
    'users',
    [
        pgColumn('id', pgColumnTypes.serial, false),
        pgColumn('userName', pgColumnTypes.varchar, false),
        pgColumn('createdAt', pgColumnTypes.date, false),
    ]
)

const employeesTable = pgTable(
    'employees',
    [
        pgColumn('id', pgColumnTypes.serial, false),
        pgColumn('managerId', pgColumnTypes.int, true),
        pgColumn('name', pgColumnTypes.varchar, false),
        pgColumn('salary', pgColumnTypes.decimal, true),
        pgColumn('deptId', pgColumnTypes.int, false)
    ]
)

const customersTable = pgTable(
    'customers',
    [
        pgColumn('id', pgColumnTypes.serial, false),
        pgColumn('name', pgColumnTypes.varchar, false),
        pgColumn('createdBy', pgColumnTypes.int, false)
    ],
    undefined,
    undefined,
    [
        new ForeignKey('createdBy', { table: 'users', column: 'id' })
    ]
);


const ordersTable = pgTable(
    'orders',
    [
        pgColumn('id', pgColumnTypes.serial, false),
        pgColumn('customerId', pgColumnTypes.int, false),
        pgColumn('amount', pgColumnTypes.decimal, false),
        pgColumn('createdBy', pgColumnTypes.int, false)
    ],
    undefined,
    undefined,
    [
        new ForeignKey('customerId', { table: 'customers', column: 'id' }),
        new ForeignKey('createdBy', { table: 'users', column: 'id' })
    ]
);

const orderDetailsTable = pgTable(
    'orderDetails',
    [
        pgColumn('id', pgColumnTypes.serial, false),
        pgColumn('orderId', pgColumnTypes.int, false),
        pgColumn('amount', pgColumnTypes.decimal, false),
        pgColumn('createdBy', pgColumnTypes.int, false)
    ],
    undefined,
    undefined,
    [
        new ForeignKey('orderId', { table: 'orders', column: 'id' }),
        new ForeignKey('createdBy', { table: 'users', column: 'id' })
    ]
);

const shipmentsTable = pgTable(
    'shipments',
    [
        pgColumn('id', pgColumnTypes.serial, false),
        pgColumn('orderId', pgColumnTypes.serial, false),
        pgColumn('createdBy', pgColumnTypes.int, false)
    ],
    undefined,
    undefined,
    [
        new ForeignKey('customerId', { table: 'customers', column: 'id' }),
        new ForeignKey('createdBy', { table: 'users', column: 'id' })
    ]
);


export {
    customersTable,
    usersTable,
    ordersTable,
    orderDetailsTable,
    shipmentsTable,
    employeesTable
}