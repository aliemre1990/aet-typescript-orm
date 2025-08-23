import { pgColumnTypes } from "../../postgresql/dataTypes.js";
import Column from "../../table/column.js";
import { ForeignKey, pgTable } from "../../table/table.js";

const usersTable = pgTable(
    'users',
    {
        id: new Column('id', pgColumnTypes.serial),
        userName: new Column('userName', pgColumnTypes.varchar)
    }
)

const employeesTable = pgTable(
    'employees',
    {
        id: new Column('id', pgColumnTypes.serial),
        userName: new Column('name', pgColumnTypes.varchar)
    }
)

const customersTable = pgTable(
    'customers',
    {
        customerId: new Column('id', pgColumnTypes.serial),
        name: new Column('name', pgColumnTypes.varchar),
        createdBy: new Column('createdBy', pgColumnTypes.int)
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
        orderId: new Column('id', pgColumnTypes.serial),
        customerId: new Column('customerId', pgColumnTypes.int),
        createdBy: new Column('createdBy', pgColumnTypes.int)
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
        id: new Column('id', pgColumnTypes.serial),
        orderId: new Column('orderId', pgColumnTypes.serial),
        createdBy: new Column('createdBy', pgColumnTypes.int)
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