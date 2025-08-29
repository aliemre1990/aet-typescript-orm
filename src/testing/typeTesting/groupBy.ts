import type ISelectClause from "../../query/_interfaces/ISelectClause.js";
import type { SpreadGroupedColumns } from "../../query/_types/grouping.js";
import { customersTable, shipmentsTable, usersTable } from "./_tables.js";

const res = customersTable
    .join('INNER', usersTable, cols => cols.users.id.eq(cols.customers.createdBy))
    .join('INNER', shipmentsTable, cols => cols.shipments.id.eq(1))
    .groupBy(cols => {

        const cols1 = [cols.customers, cols.users.id, cols.shipments] as const;
        type t = SpreadGroupedColumns<typeof cols1>;

        type t0 = t[0];
        type t1 = t[1];
        type t2 = t[2];
        type t3 = t[3];
        type t4 = t[4];
        type t5 = t[5];
        type t6 = t[6];

        return [cols.customers, cols.users.id, cols.shipments]
    })
    .select(cols => ({ id: cols.customers.id, userId: cols.users.id}));
type tp = typeof res extends ISelectClause<any, any, any, infer grp> ? grp : never;
type tp1 = tp[0];
type tp2 = tp[1];
type tp3 = tp[2];

type tpg = SpreadGroupedColumns<tp>;