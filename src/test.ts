import { pgColumnTypes } from "./postgresql/dataTypes.js";
import type ColumnComparisonOperation from "./query/comparison.js";
import type { IJoinQuery } from "./query/_interfaces/IJoinQuery.js";
import ColumnLogicalOperation, { and } from "./query/logicalOperations.js";
import { param } from "./query/param.js";
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


const res6 = customersTable.join('INNER', usersTable, (cols) => cols.users.id.eq(param("ali"))).select().exec();
const res7 = customersTable
    .join('INNER', usersTable, (cols) => {

        const res1 = and(
            cols.users.id.eq(param("logic1111")),
            cols.users.userName.eq(param("logic22222")),
            and(cols.customers.createdBy.eq(235), cols.customers.name.eq(param("logicCustomerName555")), and(cols.users.id.eq(param("userId"))))
        );

        return res1;

        // const res = cols.users.id.equals(param("zart"));
        // type t = typeof res;
        // type t2 = t extends ColumnComparisonOperation<infer TDbType, infer TQueryColumn, infer TParams, infer TValueType> ? TParams : never;

        // return res;

    })
    .join('INNER', usersTable.as('parentUsers'), (cols) => {

        const res1 = and(
            cols.users.id.eq(cols.customers.id),
            cols.users.id.neq(param("logic1")),
            cols.users.userName.eq(param("logic2")),
            and(cols.customers.createdBy.eq(235), cols.customers.name.eq(param("logicCustomerName")))
        );

        return res1;
        // type tp = typeof res1;
        // type tp1 = tp extends ColumnLogicalOperation<any, infer TOps> ? TOps : never;
        // type tp2 = tp1[1];
        // type tp3 = tp2 extends ColumnComparisonOperation<any, any, infer TParams, any> ? TParams : never;

        // type tp4 = tp1[0];
        // type tp5 = tp4 extends ColumnComparisonOperation<any, any, infer TParams, any> ? TParams : never;

        // type tp6 = tp1[2];
        // type tp7 = tp6 extends ColumnLogicalOperation<any, infer TOps> ? TOps : never;
        // type tp8 = tp7[1];
        // type tp9 = tp8 extends ColumnComparisonOperation<any, any, infer TParams, any> ? TParams : never;

        // const res = cols.users.id.equals(pgParam("asdf"));

        // type t = typeof res;
        // type t2 = t extends ColumnComparisonOperation<infer TDbType, infer TQueryColumn, infer TParams, infer TValueType> ? TParams : never;

        // return res;

    })
    .join('INNER', ordersTable, (cols) => cols.users.userName.eq(param("ali")))
    .select().exec();

const res2 = customersTable
    .join('INNER', usersTable, (cols) => {
        type t = typeof cols;

        return cols.users.id.eq(1);
    })
    .join('INNER', ordersTable, (cols) => {
        type t = typeof cols;


        return cols.orders.id.eq(1);

    })
    .join('INNER', shipmentsTable, (cols) => {
        type t = typeof cols;

        return cols.shipments.orderId.eq(1);
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

        return cols.users.id.eq(1);
    })
    .join('INNER', usersTable.as("parentUsers"), (cols) => {
        type t = typeof cols;
        type t2 = typeof cols.users.id;
        return cols.parentUsers.id.eq(1);
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