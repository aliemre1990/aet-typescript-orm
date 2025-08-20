import { pgColumnTypes } from "./postgresql/dataTypes.js";
import Column from "./table/column.js";
import { ForeignKey, pgTable } from "./table/table.js";


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


const res = customersTable.select(cols => {
    type t = typeof cols;

    return ({ id: cols.customers.name.as("customerName") })
}).exec();


const res5 = customersTable.select().exec();

const res6 = customersTable.join('INNER', usersTable, (cols) => cols.users.id).select().exec();
const res7 = customersTable
    .join('INNER', usersTable, (cols) => cols.users.id)
    .join('INNER', usersTable.as('parentUsers'), (cols) => cols.users.id)
    .select().exec();

const res2 = customersTable
    .join('INNER', usersTable, (cols) => {
        type t = typeof cols;

        return cols.users.id
    })
    .join('INNER', ordersTable, (cols) => {
        type t = typeof cols;


        return cols.orders.id

    })
    .join('INNER', shipmentsTable, (cols) => {
        type t = typeof cols;

        return cols.shipments.orderId;
    })
    .select(cols => ({ asdf: cols.customers.id, asdsfxc: cols.orders.customerId, customerName: cols.customers.name }))
    .exec();

// const tbl = usersTable.as("parentUsers");
// type t = typeof tbl;
// const queryColumns = tbl.columns;
// type t2 = typeof queryColumns;

// type cols = typeof usersTable.columns[keyof typeof usersTable.columns];
// type typleCols = UnionToTupleOrdered<cols>;

const rese = customersTable
    .join('INNER', usersTable, (cols) => {
        type t = typeof cols;

        return cols.users.id;
    })
    .join('INNER', usersTable.as("parentUsers"), (cols) => {
        type t = typeof cols;
        type t2 = typeof cols.users.id;
        return cols.parentUsers.id
    })
    .select(cols => {
        type t = typeof cols;
        return ({
            asdf: cols.customers.id,
            asdsfxc: cols.users.userName.as("username1"),
            cdf: {
                parentUserId: cols.parentUsers.id,
                customers: cols.customers
            }
        })
    }
    )
    .exec();
// const res2 = customersTable.innerJoin(usersTable,(cols)=> cols.customers.id).select(cols=>({userId:cols.users.id,customerId:cols.customers.id})).exec();


// const query = customersTable.innerJoin(usersTable, (cols) => new ComparisonOperation()).select(cols => ({ asdfa: cols.users.username }))

// const res = query.exec();