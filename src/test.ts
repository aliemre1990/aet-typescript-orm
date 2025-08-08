import { pgColumnTypes } from "./postgresql/dataTypes.js";
import { Column, ForeignKey, pgTable } from "./table.js";


const usersTable = pgTable(
    'users',
    {
        id: new Column('id', pgColumnTypes.PgSerialType),
        userName: new Column('userName', pgColumnTypes.PgVarcharType)
    }
)

const customersTable = pgTable(
    'customers',
    {
        customerId: new Column('id', pgColumnTypes.PgSerialType),
        name: new Column('name', pgColumnTypes.PgVarcharType),
        createdBy: new Column('createdBy', pgColumnTypes.PgIntType)
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
        orderId: new Column('id', pgColumnTypes.PgSerialType),
        customerId: new Column('customerId', pgColumnTypes.PgIntType),
        createdBy: new Column('createdBy', pgColumnTypes.PgIntType)
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
        id: new Column('id', pgColumnTypes.PgSerialType),
        orderId: new Column('orderId', pgColumnTypes.PgSerialType),
        createdBy: new Column('createdBy', pgColumnTypes.PgIntType)
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


const rese = customersTable
    .innerJoin(usersTable, (cols) => cols.users.id)
    .innerJoin(usersTable.as("parentUsers"), (cols) => {
        type t = typeof cols;
        return cols.parentUsers.id
    })
    .select(cols => ({ asdf: cols.customers.id, asdsfxc: cols.users.userName, cdf: cols.parentUsers }))
    .exec();
// const res2 = customersTable.innerJoin(usersTable,(cols)=> cols.customers.id).select(cols=>({userId:cols.users.id,customerId:cols.customers.id})).exec();


// const query = customersTable.innerJoin(usersTable, (cols) => new ComparisonOperation()).select(cols => ({ asdfa: cols.users.username }))

// const res = query.exec();