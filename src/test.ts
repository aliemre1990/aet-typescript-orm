import { pgColumnTypes } from "./postgresql/dataTypes.js";
import { Column, ForeignKey, pgTable, QueryTable, type QueryColumn, type TableToColumnsMap, type TableToObject } from "./table.js";


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


const res = customersTable.select(cols => {
    type t = typeof cols;

    return ({ id: cols.customers.name.as("customerName") })
}).exec();
const res2 = customersTable
    .innerJoin(usersTable, (cols) => {
        type t = typeof cols;

        return cols.users.id
    })
    .innerJoin(ordersTable, (cols) => {
        type t = typeof cols;


        return cols.orders.id

    })
    .innerJoin(shipmentsTable, (cols) => {
        type t = typeof cols;

        return cols.shipments.orderId;
    })
    .select(cols => ({ asdf: cols.customers.id, asdsfxc: cols.orders.customerId }))
    .exec();

// const tbl = usersTable.as("parentUsers");
// type t = typeof tbl;
// const queryColumns = tbl.columns;
// type t2 = typeof queryColumns;

const rese = customersTable
    .innerJoin(usersTable, (cols) => {
        type t = typeof cols;

        return cols.users.id;
    })
    .innerJoin(usersTable.as("parentUsers"), (cols) => {
        type t = typeof cols;
        type t2 = typeof cols.users.id;
        return cols.parentUsers.id
    })
    .select(cols => {
        type t = typeof cols;
        return ({ asdf: cols.customers.id, asdsfxc: cols.users.userName, cdf: cols.parentUsers })
    }
    )
    .exec();
// const res2 = customersTable.innerJoin(usersTable,(cols)=> cols.customers.id).select(cols=>({userId:cols.users.id,customerId:cols.customers.id})).exec();


// const query = customersTable.innerJoin(usersTable, (cols) => new ComparisonOperation()).select(cols => ({ asdfa: cols.users.username }))

// const res = query.exec();