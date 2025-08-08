import { pgColumnTypes } from "./postgresql/dataTypes.js";
import { Column, ForeignKey, pgTable } from "./table.js";


const usersTable = pgTable(
    'users',
    {
        id: new Column('id', pgColumnTypes.serial),
        userName: new Column('userName', pgColumnTypes.varchar)
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
        orderId: new Column('orderId', pgColumnTypes.int),
        createdBy: new Column('createdBy', pgColumnTypes.int)
    },
    undefined,
    undefined,
    [
        new ForeignKey('customerId', { table: 'customers', column: 'id' }),
        new ForeignKey('createdBy', { table: 'users', column: 'id' })
    ]
);

const res = customersTable.select(cols => ({ id: cols.customers.name.as("customerName") })).exec();
const res2 = customersTable
    .innerJoin(usersTable, (cols) => {

        return cols.users.id
    })
    .innerJoin(ordersTable, (cols) => {
        type t = typeof cols;


        return cols.orders.id

    })
    .innerJoin(shipmentsTable, (cols) => cols.shipments.orderId)
    .select(cols => ({ asdf: cols.customers.id, asdsfxc: cols.orders.customerId }))
    .exec();


const res3 = customersTable
    .innerJoin(usersTable, (cols) => cols.users.id)
    .innerJoin(usersTable.as("parentUsers"), (cols) => {
        type t = typeof cols;
        return cols.parentUsers.id
    })
    .select(cols => ({ p: cols.parentUsers, asdf: cols.customers, asdsfxc: cols.users.userName }))
    .exec();
// const res2 = customersTable.innerJoin(usersTable,(cols)=> cols.customers.id).select(cols=>({userId:cols.users.id,customerId:cols.customers.id})).exec();


// const query = customersTable.innerJoin(usersTable, (cols) => new ComparisonOperation()).select(cols => ({ asdfa: cols.users.username }))

// const res = query.exec();