import type ColumnComparisonOperation from "../../query/comparisons/_comparisonOperations.js";
import coalesce from "../../query/functions/coalesce.js";
import ColumnLogicalOperation, { and } from "../../query/logicalOperations.js";
import { param } from "../../query/param.js";
import type QueryColumn from "../../query/queryColumn.js";
import type Column from "../../table/column.js";
import type { TableSpecsType } from "../../table/types/tableSpecs.js";
import { customersTable, ordersTable, usersTable } from "./_tables.js";
import type { AssertEqual, AssertTrue } from "./_typeTestingUtilities.js";

const AutoSelectMultiJoins = customersTable
    .join('INNER', usersTable, (cols) => {

        const res1 = coalesce(1, 2, param("param"), coalesce(1, 2, 3, param("param1"), coalesce(1, 2, 3, 4, param("asdf")))).eq(1);

        type T = typeof res1 extends ColumnComparisonOperation<any, infer TFns, infer TParams, any, any> ? TFns : never;

        return res1;

        // const inres = cols.users.id.sqlIn(1, cols.customers.id, 2, cols.users.id, cols.customers.id);
        // type inrest = typeof inres extends ColumnComparisonOperation<any, any, any, infer TCols, any> ? TCols : never;
        // type prm = inrest[1];
    })
    .join('INNER', usersTable.as('parentUsers'), (cols) => cols.users.id.eq(1))
    .join('INNER', ordersTable, (cols) => cols.users.userName.eq(cols.customers.name))
    .select()
    .exec;