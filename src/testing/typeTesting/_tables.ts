import { pgColumnTypes } from "../../postgresql/dataTypes.js";
import Column from "../../table/column.js";
import { ForeignKey, pgColumn, pgTable } from "../../table/table.js";

const usersTable = pgTable(
    'users',
    {
        id: pgColumn('id', pgColumnTypes.serial, false),
        userName: pgColumn('userName', pgColumnTypes.varchar, false),
        createdAt: pgColumn('createdAt', pgColumnTypes.date, false),
    }
)

const employeesTable = pgTable(
    'employees',
    {
        id: pgColumn('id', pgColumnTypes.serial, false),
        userName: pgColumn('name', pgColumnTypes.varchar, false),
        salary: pgColumn('salary', pgColumnTypes.decimal, true),
        deptId: pgColumn('deptId', pgColumnTypes.int, false)
    }
)

const customersTable = pgTable(
    'customers',
    {
        customerId: pgColumn('id', pgColumnTypes.serial, false),
        name: pgColumn('name', pgColumnTypes.varchar, false),
        createdBy: pgColumn('createdBy', pgColumnTypes.int, false)
    },
    undefined,
    undefined,
    [
        new ForeignKey('createdBy', { table: 'users', column: 'id' })
    ]
);


const ordersTable = pgTable(
    'orders',
    {
        orderId: pgColumn('id', pgColumnTypes.serial, false),
        customerId: pgColumn('customerId', pgColumnTypes.int, false),
        createdBy: pgColumn('createdBy', pgColumnTypes.int, false)
    },
    undefined,
    undefined,
    [
        new ForeignKey('customerId', { table: 'customers', column: 'id' }),
        new ForeignKey('createdBy', { table: 'users', column: 'id' })
    ]
);

const shipmentsTable = pgTable(
    'shipments',
    {
        id: pgColumn('id', pgColumnTypes.serial, false),
        orderId: pgColumn('orderId', pgColumnTypes.serial, false),
        createdBy: pgColumn('createdBy', pgColumnTypes.int, false)
    },
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
    shipmentsTable,
    employeesTable
}